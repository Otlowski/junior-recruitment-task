//DOM elements
var addTaskBtn    = document.getElementById('add-task'),
    removeTaskBtn = document.getElementById('delete-task'),
    statusTaskBtn = document.getElementById('change-status'),

    addTaskInput  = document.getElementById('add-task-input'),
    tasksTable    = document.getElementById('tasks-table');
//clear forms
    addTaskInput.value = '';

// //Call methods
getTasksList();
//Get Tasks List
function getTasksList(){
  console.log('[DEBUG] - getTasksList method call]');
  var request = new XMLHttpRequest();
  var data    = new FormData();
  data.append('data-function','list');

  request.onreadystatechange = function(){
        if (request.readyState === 4 && request.status === 200) {
          //response
          var tasksList = JSON.parse(request.response);
          //call function to append tasks
          appendTasks(tasksList);

        }
    }
    request.open("POST", "../backend/ajaxHandler.php", true);
    request.send(data);

  }
//Append all tasks
function appendTasks(tasksList){
    //tasks table
    var tasksTable = document.getElementById('tasks-table');
    //for each task create new row in table
    for (var i = 0, len = tasksList.length; i < len; i++) {
         //Task's properties
         var taskDbId      = tasksList[i].id;
         var checkStatus = tasksList[i].status;
         var status = checkStatus == 1 ? status = 'active' : status = 'disactive'
         var content = tasksList[i].content;
         var taskUniqueId = new Date().valueOf()+i*i
         //create DOM elements
         var newTaskRow = document.createElement('div');
             newTaskRow.className  = 'tasks__item';
             newTaskRow.classList.add(status);
             newTaskRow.setAttribute('data-task-db-id',taskDbId);
             newTaskRow.id = taskUniqueId;
             newTaskRow.innerHTML = taskItemActive;
             //create new div with text content
             var textTask = document.createElement('div');
                 textTask.className = 'tasks__item-text';
             var textValue = document.createTextNode(content)
                 textTask.appendChild(textValue);
             newTaskRow.appendChild(textTask);
             //events
             newTaskRow.onclick = function(e){
               //update status - 1st option
               if(e.target && e.target.className == "checkbox-content"){
                 var taskSelector = e.target.parentNode.parentNode;
                 var taskUniqueId = taskSelector.id;
                 var taskDbId = taskSelector.getAttribute('data-task-db-id');
                 //taskUniqueId - to change view content, taskDbId - to update database row
                 updateTaskStatus(taskUniqueId, taskDbId);
               }
                //update status - 2nd option
                if(e.target && e.target.id == "change-status"){
                  var taskSelector = e.target.parentNode.parentNode.parentNode;
                  var taskUniqueId = taskSelector.id;
                  var taskDbId = taskSelector.getAttribute('data-task-db-id');
                  //taskUniqueId - to change view content, taskDbId - to update database row
                  updateTaskStatus(taskUniqueId, taskDbId);
                }
               //delete task
               if(e.target && e.target.id == "delete-task")
               {
                 var taskSelector = e.target.parentNode.parentNode;
                 var taskUniqueId = taskSelector.id;
                 var taskDbId = taskSelector.getAttribute('data-task-db-id');
                 deleteTask(taskUniqueId, taskDbId);
               }


             };
             var addTaskItem = document.getElementsByClassName('tasks__item--add')[0];
             tasksTable.insertBefore(newTaskRow, addTaskItem);
            //  var thisItem = document.querySelectorAll('[task-data-unique-id='+taskUniqueId+']');
            //  console.log(thisItem);
    }
  };
//Update Task after change status
function updateTaskStatus(taskUniqueId,taskDbId){

  var statusBool  = document.getElementById(taskUniqueId).classList.contains('active');
  if(statusBool){ var statusParam = 0;}
  else var statusParam = 1;
  // console.log(statusParam);
  //API Method
  var request = new XMLHttpRequest();
  var data    = new FormData();
      data.append('data-function','update');
      data.append('data-id',taskDbId);
      data.append('data-status',statusParam);

      request.onreadystatechange = function(){
          if (request.readyState === 4 && request.status === 200) {
              //response
              var updatedTask = JSON.parse(request.response);

              //Change Content
              if(document.getElementById(taskUniqueId).classList.contains('disactive')){
                 document.getElementById(taskUniqueId).classList.remove('disactive');
                 document.getElementById(taskUniqueId).classList.add('active');
              }else{
                 document.getElementById(taskUniqueId).classList.add('disactive');
                 document.getElementById(taskUniqueId).classList.remove('active');
              }
            }
      }
    request.open("POST", "../backend/ajaxHandler.php", true);
    request.send(data);

}
//Delete Task
function deleteTask(taskUniqueId,taskDbId){

  var request = new XMLHttpRequest();
  var data    = new FormData();
      data.append('data-function','delete');
      data.append('data-id',taskDbId);

      request.onreadystatechange = function(){
          if (request.readyState === 4 && request.status === 200) {
              //response
              var updatedTask = JSON.parse(request.response);
              //Remove elements from DOM
              var removeElement = document.getElementById(taskUniqueId);
                  removeElement.outerHTML ="";
                  delete removeElement;
            }
      }
    request.open("POST", "../backend/ajaxHandler.php", true);
    request.send(data);
}

//On addNewTask Click
addTaskBtn.onclick = function(){
  apiAddTask();
}
function apiAddTask(){
  //prepare parameters
  var description = addTaskInput.value;
  //conditional if isset description
  if(description){
      var request = new XMLHttpRequest();
      var data    = new FormData();
      data.append('data-function','add');
      data.append('data-description', description);

      request.onreadystatechange = function(){
            if (request.readyState === 4 && request.status === 200) {
              //response
              var response =  JSON.parse(request.response);
              console.log(response);
              //Append added task content
              var tasksTable = document.getElementById('tasks-table');
                  tasksTable.innerHTML='';
                  tasksTable.innerHTML=taskItemAddRow;
                  addTaskInput.value = '';
              getTasksList();
            }
        }
        request.open("POST", "../backend/ajaxHandler.php", true);
        request.send(data);
  }

};
//Templates
const taskItemActive =
 `<div class="tasks__item-checkbox">
      <div class="checkbox-content">
          <img id="change-status" src="img/checkmark.png" ">
      </div>
  </div>
  <div class="tasks__item-delete">
      <img id="delete-task" src="img/trash.png">
  </div>`;
const taskItemAddRow =
`<div class="tasks__item tasks__item--add">
     <div class="tasks__item-button-plus">
         <img id="add-task" src="img/add-button.png">
     </div>
     <input id="add-task-input" class="add-new-task" placeholder="Add new task">
</div>`;
