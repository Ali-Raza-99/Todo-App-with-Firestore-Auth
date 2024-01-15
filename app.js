// sign in code area ////////////////////////////////////////////////////////////////

const db = firebase.firestore();
let addBtn = document.getElementById('addBtn');
let databox = document.getElementById('databox');
let inp = document.getElementById('inp');
let todosRef = db.collection(`${'Todos'}`);
let logUser = document.getElementById('username')
let counter = 0;
let deleteBtn = document.querySelector('.deleteBtn')

let loginPassowrd = document.getElementById('login-password')
let loginInp = document.getElementById('login-inp')

let signupPassword = document.getElementById('signin-password')
let signupInp = document.getElementById('signin-inp')




const signUp = () => {
    firebase.auth().createUserWithEmailAndPassword(signupInp.value, signupPassword.value)
    .then((userCredential) => {
        let user = userCredential.user;
        console.log(user.uid)

        db.collection(`${`Users`}`).doc(`${user.uid}`).set({
            name: newUserName.value,
            userid: user.uid
        }).then(() => {
            console.log('user added successfully')
            location.replace("login.html")


        })

        //   location.replace("index.html")
        // Signed in 
        // ...
    })
    .catch((error) => {
        let signinErrorText = document.getElementById('signin-error-message')
         
        var errorCode = error.code;
        var errorMessage = error.message;
        signinErrorText.innerHTML = `<p>${errorMessage}</p>`
        //   console.log(error.message)
        // ..
    });
}


// sign in code area ////////////////////////////////////////////////////////////////

const signOutUser = () => {
    firebase.auth().signOut().then(() => {
        console.log('user is signout ')
        window.location.href = 'login.html'
    }).catch((error) => {
        console.log('cant signout')
    });
}

const currentUser = () => {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            let uid = user.uid;
            let email = user.email
        
        
            getData(uid)

        addBtn.addEventListener('click', (email, username) => {

            counter = counter += 1

            db.collection(`${uid}`).doc(`${counter}`).set({
                todo: inp.value
            })

                .then(() => {
                    databox.innerHTML += `
            <div id='todos${counter}' class="todos-parent row d-flex align-items-center mb-1">
        <div  class="data px-2 col-lg-9 com-md-9 col-sm-9 col-9">
            <h4 id='editInp${counter}'>${inp.value}</h4>
        </div>
        <div class="dynamic-btn  col-lg-2 col-md-2 col-sm-2 col-2 d-flex">
            <button onclick="editBtn(editInp${counter},${counter},'${uid}')" class="btn btn-success mx-2"><i class="fa-solid fa-pen"></i></button>
            <button onclick="delBtn('todos${counter}',${counter},'${uid}')" class="btn btn-danger deleteBtn"><i class="fa-solid fa-minus"></i></button>
        </div>
    </div>
    `
            console.log("Document successfully added!" + inp.value);
            inp.value = ''

        })
        .catch((error) => {
            console.error("Error while adding document: ", error);
        });
                    })


db.collection(`${`Users`}`).doc(`${uid}`).get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        // currentUser = doc.data().name
        logUser.innerHTML = `
        <h5>${doc.data().name}</h5>
        
        `
        }

    else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


            // ...
        } else {
            signOutUser()
         
        }
    });



}

const login = () => {

    firebase.auth().signInWithEmailAndPassword(loginInp.value, loginPassowrd.value)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = 'index.html'
            let login_btn = document.getElementById('login_btn');
            login_btn.style.display = "none";

        })

        .catch((error) => {
            let loginErrorText = document.getElementById('login-error-message')
            var errorCode = error.code;
            var errorMessage = error.message;
            loginErrorText.innerHTML = `<p>${errorMessage}</p>`

        });
}

// login code area ////////////////////////////////////////////////////



// document.addEventListener('keypress', function (e) {
//     if (e.keyCode == '13') {
//         if (inp.value == '') {
//             alert('Please Enter some Todos')
//         }
//         else if (inp.value.length >= 60) {
//             alert('Please Enter short Todos')
//         }
//         else {
//             addTodo()
//         }
//     }
// })



const delBtn = (todos_id, idCounter, uid) => {
    
    let todos_parent = document.getElementById(`${todos_id}`)
    db.collection(`${uid}`).doc(`${idCounter}`).delete().then(() => {
        console.log(`${uid} ,${idCounter}`);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    console.log(todos_parent)
    todos_parent.remove()
}

const editBtn = (todos_id, idCounter,uid) => {

    todos_id.innerHTML = `<input id="editInp" type="text" class="form-control" placeholder="Edit Todo" aria-label="Recipient's username" aria-describedby="button-addon2">`
    let dynamicInput = document.getElementById('editInp');

    dynamicInput.addEventListener('blur', function edittedTodos(e) {

        dynamicInput.setAttribute('value', dynamicInput.value)

        if (dynamicInput.value.length >= 60) {
            alert('Please Edit and Add short Todos')
        }
        else {
            todos_id.innerHTML = dynamicInput.value
            db.collection(`${uid}`).doc(`${idCounter}`).set({
                todo: dynamicInput.value
            })
                .then(() => {
                    console.log("Document editted written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }
    })
}

const getData = (uid) => {

    db.collection(`${uid}`).get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            databox.innerHTML += `
        <div id='todos${doc.id}' class="todos-parent row d-flex align-items-center mb-1">
            <div  class="data px-2 col-lg-9 com-md-9 col-sm-9 col-9">
                <h4 id='editInp${doc.id}'>${doc.data().todo}</h4>
            </div>
            <div class="dynamic-btn  col-lg-2 col-md-2 col-sm-2 col-2 d-flex">
                <button onclick="editBtn(editInp${doc.id},${doc.id},'${uid}')" class="btn btn-success mx-2"><i class="fa-solid fa-pen"></i></button>
                <button onclick="delBtn('todos${doc.id}',${doc.id},'${uid}')" class="btn btn-danger deleteBtn"><i class="fa-solid fa-minus"></i></button>
            </div>
        </div>
        `

        });
    });

}




// getUserName()
// currentUser()
// getData()
