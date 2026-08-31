<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/../db.php';
    require_once __DIR__ . '/../../includes/Session.php';
    Session::start();
    Session::requireLogin();

    $projectUuid = $_GET['project'] ?? null;
    if (!$projectUuid) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Paramètre project manquant.']);
        exit;
    }

    $db = getDB();

    $stmtProj = $db->prepare('SELECT pro_id FROM TOG_PROJECTS WHERE pro_uuid = ?');
    $stmtProj->execute([$projectUuid]);
    $proj = $stmtProj->fetch();

    if (!$proj) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Projet introuvable.']);
        exit;
    }

    $projectId = (int) $proj['pro_id'];

    $ordre     = $_GET['sort'] ?? null;
    $statut    = $_GET['statut'] ?? null;
    $priorite  = $_GET['priorite'] ?? null;
    $assigner  = $_GET['assignee'] ?? null;
    $dateStart = $_GET['date_start'] ?? null;
    $dateEnd   = $_GET['date_end'] ?? null;

    function getOrderBySQL(?string $sort): string {
        switch ($sort) {
            case 'asc':
                return 't.tas_titre ASC';
            case 'desc':
                return 't.tas_titre DESC';
            default:
                return 't.tas_id DESC';
        }
    }

    function formatDateSQL(?string $date): ?string {
        if (empty($date)) return null;
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return ($d && $d->format('Y-m-d') === $date) ? $d->format('Y-m-d') : null;
    }

    $conditions = ["t.tas_project_id = :project_id"];
    $params = [':project_id' => $projectId];

    if (!empty($statut)) {
        $conditions[] = "t.tas_statut_id = :statut";
        $params[':statut'] = (int)$statut;
    }

    if (!empty($priorite)) {
        $conditions[] = "t.tas_priorite_id = :priorite";
        $params[':priorite'] = (int)$priorite;
    }

    if (!empty($assigner)) {
        $conditions[] = "tta.tta_user_id = :assignee_id";
        $params[':assignee_id'] = (int)$assigner;
    }

    $dateStartFormatted = formatDateSQL($dateStart);
    $dateEndFormatted   = formatDateSQL($dateEnd);

    if ($dateStartFormatted) {
        $conditions[] = "t.tas_date_fin >= :date_start";
        $params[':date_start'] = $dateStartFormatted . " 00:00:00";
    }

    if ($dateEndFormatted) {
        $conditions[] = "t.tas_date_fin <= :date_end";
        $params[':date_end'] = $dateEndFormatted . " 23:59:59";
    }

    $whereClause = 'WHERE ' . implode(' AND ', $conditions);
    $orderByClause = getOrderBySQL($ordre);

    $sql = "SELECT DISTINCT
                t.tas_id,
                t.tas_sprint_id,
                t.tas_titre,
                t.tas_description,
                t.tas_date_debut AS date_debut,
                t.tas_date_fin AS date_fin,
                rst.rst_label AS statut,
                rpr.rpr_label AS priorite,
                CONCAT(u_rep.use_prenom, ' ', u_rep.use_nom) AS reporter
            FROM TOG_TASKS t
            LEFT JOIN TOG_TASK_ASSIGNEES tta ON t.tas_id = tta.tta_task_id
            LEFT JOIN TOG_REF_STATUT_TACHE rst ON t.tas_statut_id = rst.rst_id
            LEFT JOIN TOG_REF_PRIORITE rpr ON t.tas_priorite_id = rpr.rpr_id
            LEFT JOIN TOG_USERS u_rep ON t.tas_reporter_id = u_rep.use_id
            {$whereClause}
            ORDER BY {$orderByClause}";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($tasks)) {
        echo json_encode([
            'success' => true,
            'tasks'   => []
        ]);
        exit;
    }

    $taskIds = array_column($tasks, 'tas_id');
    $inClause = implode(',', array_fill(0, count($taskIds), '?'));

    $assigneesByTask = [];
    $sqlAssignees = "SELECT tta.tta_task_id, CONCAT(u.use_prenom, ' ', u.use_nom) AS nom, u.use_id AS id
                     FROM TOG_TASK_ASSIGNEES tta
                     JOIN TOG_USERS u ON tta.tta_user_id = u.use_id
                     WHERE tta.tta_task_id IN ({$inClause})";
    $stmtAss = $db->prepare($sqlAssignees);
    $stmtAss->execute($taskIds);
    while ($row = $stmtAss->fetch(PDO::FETCH_ASSOC)) {
        $assigneesByTask[$row['tta_task_id']][] = [
            'id'  => $row['id'],
            'nom' => $row['nom']
        ];
    }

    $etiquettesByTask = [];
    $sqlTags = "SELECT tte.tte_task_id, e.eti_label AS label, e.eti_couleur AS couleur, e.eti_id AS id
                FROM TOG_TASK_ETIQUETTES tte
                JOIN TOG_ETIQUETTES e ON tte.tte_eti_id = e.eti_id
                WHERE tte.tte_task_id IN ({$inClause})";
    $stmtTags = $db->prepare($sqlTags);
    $stmtTags->execute($taskIds);
    while ($row = $stmtTags->fetch(PDO::FETCH_ASSOC)) {
        $etiquettesByTask[$row['tte_task_id']][] = [
            'id'      => $row['id'],
            'label'   => $row['label'],
            'couleur' => $row['couleur']
        ];
    }

    $formattedTasks = array_map(function ($t) use ($assigneesByTask, $etiquettesByTask) {
        $id = $t['tas_id'];
        return [
            'id'         => $id,
            'sprint_id'  => $t['tas_sprint_id'],
            'reporter'   => $t['reporter'],
            'assignes'   => $assigneesByTask[$id]   ?? [],
            'etiquettes' => $etiquettesByTask[$id]  ?? [],
            'titre'      => $t['tas_titre'],
            'desc'       => $t['tas_description'],
            'statut'     => $t['statut'],
            'priorite'   => $t['priorite'],
            'date_debut' => $t['date_debut'],
            'date_fin'   => $t['date_fin'],
        ];
    }, $tasks);

    echo json_encode([
        'success' => true,
        'tasks'   => $formattedTasks
    ]);
    exit;

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur : ' . $e->getMessage()
    ]);
}