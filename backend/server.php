<?php
  //DataBase Creator
  try {
        //open database
        $db_conn = new PDO('sqlite:tasks.sqlite');
        //prepareQuery - create new 'tasks' table if does not exist
        $createQuery = "CREATE TABLE IF NOT EXISTS tasks
        ( id INTEGER PRIMARY KEY,
          content TEXT,
          status BOOLEAN,
          task_order INTEGER)";

        $db_conn->exec($createQuery);
  } catch (Exception $e) {
        echo $e->getMessage();
  }
  //include Taks Controller
  include_once 'tasksController.php'
?>
