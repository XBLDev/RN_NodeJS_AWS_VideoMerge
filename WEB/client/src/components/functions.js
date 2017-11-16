export function checkIfEmailsAreSame(userEmail, confirmationEmail) {
    return userEmail == confirmationEmail;
}

export function checkIfEmailsValid(userEmail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(userEmail);
}

export function checkIfNameValid(userName) {
    return userName.length >= 3;
}

export function sendRequest(userFullName, userEmail)
{
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth');
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) 
      {
          return 'succeed';
        //   this.setState({sendingMsg: 'succeed', serverReturned: true});
      }
      if(xhr.status === 400)
      {
          return JSON.parse(xhr.response).errorMessage;
        // this.setState({sendingMsg: JSON.parse(xhr.response).errorMessage}); 
      }
    });        

    xhr.send(JSON.stringify({name: userFullName, email: userEmail}));
}