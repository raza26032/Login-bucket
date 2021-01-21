var url = "http://localhost:5000"
// var url = "https://twitter-jahan.herokuapp.com"

// var socket = io(url);
// socket.on('connect', function () {
//     console.log("connected")
// });

function signup() {
    axios({
        method: 'post',
        url: url + '/signup',
        data: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "../login.html"
        } else {
            alert(response.data.message);
        }
    }).catch((error) => {
        console.log(error);
    });
    return false
}

function login() {
    axios({
        method: 'post',
        url: url + '/login',
        data: {
            email: document.getElementById('lemail').value,
            password: document.getElementById('lpassword').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "./profile.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

function forgetPassword() {
    let email = document.getElementById('femail').value;
    localStorage.setItem('email', email)
    axios({
        method: 'post',
        url: url + '/forget-password',
        data: {
            email: email,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "../forget2.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

function forgetPassword2() {
    let getEmail = localStorage.getItem('email')
    axios({
        method: 'post',
        url: url + '/forget-password-2',
        data: {
            email: getEmail,
            newPassword: document.getElementById('newPassword').value,
            otp: document.getElementById('otp').value,
        },
        withCredentials: true
    }).then((response) => {
        if (response.data.status === 200) {
            alert(response.data.message)
            location.href = "../login.html"
        }
        else {
            alert(response.data.message)
        }
    }, (error) => {
        console.log(error);
    });
    return false
}

function logout() {
    axios({
        method: 'post',
        url: url + '/logout',
    }).then((response) => {
        location.href = "../login.html"
    }, (error) => {
        console.log(error);
    });
    return false
}

function getProfile() {
    // console.log("url=>", url);
    axios({
        method: 'get',
        url: url + "/profile",
    }).then((response) => {
        // console.log("welcoming user==>", response);
        console.log(response.data);
        document.getElementById('welcomeUser').innerHTML = response.data.profile.userName;
        sessionStorage.setItem("userEmail", response.data.profile.userEmail);
        if (response.data.profile.profileUrl) {
            document.getElementById("fileInput").style.display = "none";
            document.getElementById("uploadBtn").style.display = "none";
            document.getElementById("profilePic").src = response.data.profile.profileUrl;

        }
        getTweets();
    }, (error) => {
        // console.log(error.message);
        location.href = "./login.html"
        // console.log("this is my error", error);
    });

}

const getTweets = () => {
    document.getElementById("posts").innerHTML = "";
    const Http = new XMLHttpRequest();
    Http.open("GET", url + "/getTweets");
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {

            data = JSON.parse((Http.responseText));
            // console.log(data);
            console.log(data)
            for (let i = 0; i < data.tweets.length; i++) {
                date = moment((data.tweets[i].createdOn)).fromNow()
                // if (data.tweets[i].userEmail !== userEmail) {
                var eachTweet = document.createElement("li");

                eachTweet.innerHTML =
                    `                <h4 class="userName">
                ${data.tweets[i].userName}
            </h4> 
            <small class="timeago">${date}</small>
        
            <p class="userPost" datetime=${date}>
                ${data.tweets[i].tweetText}
            </p>`;


                // console.log(`User: ${tweets[i]} ${tweets[i].userPosts[j]}`)
                document.getElementById("posts").appendChild(eachTweet)
                // }
            }
        }
    }

}



const postTweet = () => {

    userEmail = sessionStorage.getItem("userEmail");
    const Http = new XMLHttpRequest();
    Http.open("POST", url + "/postTweet")
    Http.setRequestHeader("Content-Type", "application/json");
    Http.send(JSON.stringify({
        userEmail: userEmail,
        tweetText: document.getElementById("tweetText").value,
    }))


    document.getElementById("tweetText").value = "";

}

const myTweets = () => {
    document.getElementById("posts").innerHTML = "";
    const Http = new XMLHttpRequest();
    Http.open("GET", url + "/myTweets");
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4) {
            let jsonRes = JSON.parse(Http.responseText)
            // console.log(jsonRes);
            for (let i = 0; i < jsonRes.tweets.length; i++) {
                // console.log(`this is ${i} tweet = ${jsonRes.tweets[i].createdOn}`);

                var eachTweet = document.createElement("li");
                eachTweet.innerHTML =
                    `<h4 class="userName">
                    ${jsonRes.tweets[i].userName}
                </h4> 
                <small class="timeago">${jsonRes.tweets[i].createdOn}</small>
                <p class="userPost">
                    ${jsonRes.tweets[i].tweetText}
                </p>`;

                // console.log(`User: ${tweets[i]} ${tweets[i].userPosts[j]}`)
                document.getElementById("posts").appendChild(eachTweet)

            }
        }
    }
}

socket.on("NEW_POST", (newPost) => {

    var eachTweet = document.createElement("li");
    eachTweet.innerHTML =
        `<h4 class="userName">
        ${newPost.userName}
    </h4> 
    <small class="timeago">${moment(newPost.createdOn).fromNow()}</small>
    <p class="userPost">
        ${newPost.tweetText}
    </p>`;
    // console.log(`User: ${tweets[i]} ${tweets[i].userPosts[j]}`)
    document.getElementById("posts").appendChild(eachTweet)
})