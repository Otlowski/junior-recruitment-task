<?php
include 'server.php';

class tasksController
{

  private $db;

  function __construct($db_conn)
  {
      $this->db = $db_conn;
  }
  //Method API for list Tasks
  public function listTasks(){

    try {
        $query  = "SELECT * FROM tasks;";
        $queryList = $this->db->query($query);

        if($queryList){
            $responseArray = [];
            while($row = $queryList->fetch()){
                //create objects to javascript return
                $responseMsg = new stdClass();
                $responseMsg->id         = $row['id'];
                $responseMsg->content    = $row['content'];
                $responseMsg->status     = $row['status'];
                $responseMsg->task_order = $row['task_order'];
                $responseArray[] = $responseMsg;
            }
            $result = json_encode($responseArray);
            return $result;

        }else{
            echo 'Cannot receive data';
        }
    } catch (Exception $e) {
      echo $e->getMessage();
      return false;
    }
  }
  //Method API for add Task
  public function addTask($dataDescription){

    try {


        $query  = "INSERT INTO tasks (content, status) VALUES('$dataDescription', 1);";
        $queryList = $this->db->exec($query);
        //check if query is correct
        if($queryList){
          $contentProp = 'task-content';
          $methodProp  = 'task-method';

          $responseMsg = new stdClass();
          $responseMsg -> message       = 'success';
          $responseMsg -> $contentProp  = $dataDescription;
          $responseMsg -> $methodProp   = 'addTask';

          $result = json_encode($responseMsg);
          return $result;

        }else{
            echo 'Data cannot be inserted';
        }

    } catch (Exception $e) {
      echo $e->getMessage();
      return false;
    }

  }
  //Method API for update Tasks
  public function updateTask($dataId,$dataStatus){
    try {
      // $query  = "UPDATE tasks SET task_order=$dataOrder, status=$dataStatus WHERE id=$dataId;";
      $query  = "UPDATE tasks SET status=$dataStatus WHERE id=$dataId;";
      $queryDelete = $this->db->exec($query);
      if($queryDelete){
        //updated properties
        $idProp      = 'task-id';
        $methodProp  = 'task-method';
        $statusProp  = 'task-status';
        $orderProp   = 'task-order';
        //create response Object
        $responseMsg = new stdClass();
        $responseMsg -> message       = 'success';
        $responseMsg -> $idProp       = $dataId;
        $responseMsg -> $statusProp   = $dataStatus;
        // $responseMsg -> $orderProp    = $dataOrder;
        $responseMsg -> $methodProp   = 'updateTask';

        $result = json_encode($responseMsg);
        return $result;
      }else {
          echo 'Task cannot be updated';
      }
    } catch (Exception $e) {

    }
  }
  //Method API for delete Task
  public function deleteTask($dataId){
    try {
      $query  = "DELETE FROM tasks WHERE id=$dataId;";
      $queryDelete = $this->db->exec($query);
      if($queryDelete){
        $idProp      = 'task-id';
        $methodProp  = 'task-method';

        $responseMsg = new stdClass();
        $responseMsg -> message       = 'success';
        $responseMsg -> $idProp       = $dataId;
        $responseMsg -> $methodProp   = 'deleteTask';

        $result = json_encode($responseMsg);
        return $result;
      }else {
          echo 'Task cannot be delete';
      }
    } catch (Exception $e) {

    }

  }
}
