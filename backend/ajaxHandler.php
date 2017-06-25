<?php
include 'tasksController.php';

//prepare dataParams to verify which method we have choosen
$dataFunction = (string)($_POST['data-function']);
$dataOrder = '';
//check which parameters have been sent
if(isset($_POST['data-id']))          $dataId          = ($_POST['data-id']);
if(isset($_POST['data-status']))      $dataStatus      = (string)($_POST['data-status']);
if(isset($_POST['data-order']))       $dataOrder       = (string)($_POST['data-order']);
if(isset($_POST['data-description'])) $dataDescription = (string)($_POST['data-description']);

//"routing"
$taskFunction = new tasksController($db_conn);
switch ($dataFunction) {
  case 'add':
    //addTask
    $addTask = $taskFunction->addTask($dataDescription);
    //response
    if($addTask) echo $addTask;
    break;

  case 'update':
    //updateTask
    $updateTask = $taskFunction->updateTask($dataId,$dataStatus);
    //response
    if($updateTask) echo $updateTask;
    break;

  case 'delete':
    //deleteTask
    $deleteTask = $taskFunction->deleteTask($dataId);
    //response
    if($deleteTask) echo $deleteTask;
    break;

  default:
    //listTasks
    $listTask = $taskFunction->listTasks();
    //response
    if($listTask){ echo $listTask; }
    break;
}
?>
