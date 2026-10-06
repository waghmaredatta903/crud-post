let cl = console.log;

const postForm = document.getElementById("postForm")
const title = document.getElementById("title")
const body = document.getElementById("body")
const userId = document.getElementById("userId")
const updateBtn = document.getElementById("updateBtn")
const addPost = document.getElementById("addPost")
const postcontainer = document.getElementById("postcontainer")
const spinner = document.getElementById("spinner")

const BASE_URL = `https://crud-b22-e9992-default-rtdb.asia-southeast1.firebasedatabase.app`
const POST_URL = `${BASE_URL}/posts.json`

let postArr = [];


function handlespinner(flag){
    if(flag){
        spinner.classList.remove('d-none')
    } else{
        spinner.classList.add('d-none')
    }
}

//resdpost
let xhr = new XMLHttpRequest();
xhr.open("GET", POST_URL);
xhr.send(null);
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        let res = JSON.parse(xhr.response)
        for (const key in res) {
            res[key].id = key;
            postArr.unshift(res[key])
            readPost(postArr)
        }

    } else {
        cl(`Something Went Wrong !!!!`)
    }

}


// cl(postArr)

function readPost(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += ` <div class="col-md-4 mb-5" id="${ele.id}">
                <div class="card mb-3 h-100">
                    <div class="card-header">
                        <h3 class="m-0"> ${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p clas="m-0">${ele.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editpost(this)" class="btn btn-sm btn-primary" type="button">Edit</button>
                        <button onclick="deletePost(this)" class="btn btn-sm btn-danger" type="button">Remove</button>
                    </div>
                </div>
            </div>`
    });

    postcontainer.innerHTML = result;
}

function createPost(eve) {
  
    handlespinner(true)

    eve.preventDefault()
    let postObj = {
        title: title.value,
        body: body.value,
        userId: userId.value
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", POST_URL);
    xhr.send(JSON.stringify(postObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            let col = document.createElement('col');
            col.id = res.name;
            col.className = `col-md-4 mb-5`;
            col.innerHTML = `<div class="card mb-3 h-100">
                    <div class="card-header">
                        <h3 class="m-0"> ${postObj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p clas="m-0">${postObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editpost(this)" class="btn btn-sm btn-primary" type="button">Edit</button>
                        <button onclick="deletePost(this)" class="btn btn-sm btn-danger" type="button">Remove</button>
                    </div>
                </div>`;

            postcontainer.prepend(col);
            postForm.reset()

             Swal.fire({
                title: "Creae Successfully..!!!",
                text: "todo data has been successfully..!!",
                icon: "success",
                timer: 4000
             });

        } else{

        }
        handlespinner()
        
        
    }
           spinner.classList.add('d-none')


}

function editpost(ele) {

       handlespinner(true)


    let EDIT_ID = ele.closest('.col-md-4').id;
    //cl(EDIT_ID)
    localStorage.setItem('UPDATE_ID', EDIT_ID)

    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}.json`;

    let xhr = new XMLHttpRequest()
    xhr.open('GET', EDIT_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
             let res=JSON.parse(xhr.response)

             title.value=res.title,
             body.value=res.body,
             userId.value=res.userId

             addPost.classList.add('d-none')
             updateBtn.classList.remove('d-none')
        }
        
        handlespinner()
    }
}


function updatePost (ele){

    handlespinner(true)

    let UPDATE_ID = localStorage.getItem("UPDATE_ID")
    let updateObj = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }

    let update_url = `${BASE_URL}/posts/${UPDATE_ID}.json`
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", update_url);
    xhr.send(JSON.stringify(updateObj));
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)
            let col = document.getElementById(UPDATE_ID)
            col.innerHTML = `<div class="card mb-3 h-100">
                    <div class="card-header">
                        <h3 class="m-0"> ${updateObj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p clas="m-0">${updateObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="editpost(this)" class="btn btn-sm btn-primary" type="button">Edit</button>
                        <button onclick="deletePost(this)" class="btn btn-sm btn-danger"  type="button">Remove</button>
                    </div>
                </div>`;
                postForm.reset();
                addPost.classList.remove('d-none');
                updateBtn.classList.add('d-none');

                Swal.fire({
                title: "updated Successfully..!!!",
                text: "post data has been successfully..!!",
                icon: "success",
                timer: 4000
             });

        } else {
            cl(`somthing want wrong..?`)
        }
             handlespinner()


    }
}


function deletePost(ele){

    handlespinner(true)

    let DELETE_ID = ele.closest(".col-md-4").id;
   

  //  cl(DELETE_ID)
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#59d630",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let DELETE_URL = `${BASE_URL}/posts/${DELETE_ID}.json`
    cl(DELETE_URL)
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", DELETE_URL);
    xhr.send(null)
    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res  = JSON.parse(xhr.response)
            ele.closest(".col-md-4").remove()

             Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });

                    
        } else{
            cl("Something Went Wrong")
        }
            handlespinner()

            
    }
  }
});



}


postForm.addEventListener("submit", createPost);
updateBtn.addEventListener("click", updatePost);