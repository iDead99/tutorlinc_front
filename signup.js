const submitBtn = document.querySelector('.btn');
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const gender = document.getElementById('gender');
const qualification = document.getElementById('qualification');
const link = document.getElementById('link');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');

const spinner = document.querySelector('.spinner');

const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

email.addEventListener('input', () => {
   emailError.textContent='';
})
password.addEventListener('input', () => {
   passwordError.textContent='';
})
confirmPassword.addEventListener('input', () => {
   passwordError.textContent='';
})

function genderLoad(){
   const gender = [
      {name: "Male"},
      {name: "Female"},
   ];

   const selectGender=document.getElementById("gender");

   gender.forEach(gender =>{
      const option=document.createElement("option");
      option.text=gender.name;
      selectGender.appendChild(option);
   });
}

function qualificationLoad(){
   const qualification = [
       {name: "Certificate"},
       {name: "Diploma"},
       {name: "Bachelor's Degree"},
       {name: "Master's Degree"},
       {name: "Doctoral Degree (PhD)"},
   ];

   const selectQualification=document.getElementById("qualification");

   qualification.forEach(qualification =>{
      const option=document.createElement("option");
      option.text=qualification.name;
      selectQualification.appendChild(option);
   });
}

document.addEventListener('DOMContentLoaded', function() {
     genderLoad();
     qualificationLoad();
})



document.querySelector('.signup-form').addEventListener('submit',function(e) {
    e.preventDefault()

    if(password.value!==confirmPassword.value){
      passwordError.textContent='Passwords do not match!';
      return;
   }

    const userData={
        first_name: firstName.value.charAt(0).toUpperCase() + firstName.value.slice(1).toLowerCase(),
        last_name: lastName.value.charAt(0).toUpperCase() + lastName.value.slice(1).toLowerCase(),
        email: email.value,
        password: password.value,
        };

   firstRegistration(userData);

   spinner.style.display='block';
   submitBtn.disabled=true;
   if(submitBtn.disabled===true){
      submitBtn.style.opacity='50%';
   }
})

function firstRegistration(userData){
    fetch("http://127.0.0.1:8000/auth/users/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
        })
        .then(response => {
        if(!response.ok){
            return response.json().then(error =>{
                if(error.email){
                  emailError.textContent=error.email;
                  window.location.href='#email-error';
                }
                if(error.password){
                  passwordError.textContent=error.password;
                  window.location.href='#password-error';
                }
                spinner.style.display='none';
                submitBtn.disabled=false;
                if(submitBtn.disabled===false){
                    submitBtn.style.opacity='100%';
                }
            })   
        }
        else{
         spinner.style.display='none';
         submitBtn.disabled=false;
         if(submitBtn.disabled===false){
             submitBtn.style.opacity='100%';
         }

             const authUserData={
                email: email.value,
                password: password.value,
                };

        authenticateUser(authUserData);
        }
            return response.json();
        })
        .catch(error => {
         return error;
    })

    }


function authenticateUser(userData){
    fetch("http://127.0.0.1:8000/auth/jwt/create",{
        method: 'POST',
        headers: {
           'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    
       })
       .then(response => {
        if(!response.ok){
             throw new Error('authentication failed!');
          }
          return response.json();
       })
     .then(data => {
      localStorage.setItem('accessToken', data.access);

      const secondUserData={
      gender: gender.value,
      qualification: qualification.value,
      phone: phone.value,
      link: link.value,
      };
      secondRegistration(secondUserData);
    })
    .catch(error => {
     console.log('Error', error);
    });
    
}

function secondRegistration(secondUserData){
    const accessToken=localStorage.getItem('accessToken');

    fetch('http://127.0.0.1:8000/manage_tutorlinc/teachers/me/', {
    method: 'PUT',
    headers: {
       'Authorization': `JWT ${accessToken}`,
       'Content-Type': 'application/json',
    },
    body: JSON.stringify(secondUserData)
 })
 .then(response =>{
    if(!response.ok){
       throw new Error('Network was not ok');
    }
    else{
       window.location.href="signin.html";
    }
    return response.json();
 })
 .catch(error =>{
    console.log(error, 'Second registration failed')
 });
 localStorage.removeItem('accessToken');
 }
