class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [{name:"Default",message : "Good Afternoon , How may I assist you ?"},{name:"DefaultTags",tagsid:"tg1|tg2|tg3|tg11|tg15",tags : "Admision|About KDPIT|Courses|Scolarship|Contact"},
        //{name:"Default",message : "Note : Last Date For Examination form Registration is 15 Oct"}
    ];
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })

        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if(item.name === "Default")
            html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            else if(item.name === "DefaultTags"){
                html += '<div class="greeting" id="main"> <ul class="list">'
                let tagsarray=item.tags.split("|");
                let tagsidarray=item.tagsid.split("|");
                for(let i=0;i<tagsarray.length;i++){
                    console.log("Tags");
                    html += '<li id ='+tagsidarray[i]+' class="list-l" ><button type="button" class="btn btn-outline-secondary">'+tagsarray[i]+'</button></li>'
                }
                html +='</ul> </div>'
            }
        });

        const chatmessage = chatBox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;  

        this.messages.slice().reverse().forEach((item, index)=> {
            if(item.name === "DefaultTags"){
                console.log("Tags");
                let tagsidarray=item.tagsid.split("|");
                let tagsarray=item.tags.split("|");
                for(let i=0;i<tagsidarray.length;i++){
                    let chattag = document.getElementById(tagsidarray[i]);
                    let text1=tagsidarray[i];
                    let text2=tagsarray[i];
                    
                    chattag.addEventListener('click',() => {
                        
                        let msg1 = { name: "User", message: text2 }
                        this.messages.push(msg1);

                        var textField = chatBox.querySelector('input');
                        fetch('http://127.0.0.1:5000/tags', {
                        method: 'POST',
                        body: JSON.stringify({ message: text1 }),
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        })
                        .then(r => r.json())
                        .then(r => {
                            console.log("------------------------------------"+r.tagid);
                            let msg2 = { name: "DefaultTags", tags : r.tag,tagsid : r.tagid};
                            this.messages.push(msg2);
                            this.updateChatText(chatBox)
                            textField.value = ''
                        }).catch((error) => {
                            console.error('Error:', error);
                            this.updateChatText(chatBox)
                            textField.value = ''
                        });
                    });
                }
            }
        });
    }
   
    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer ,link : r.link};
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {

        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {

            if ((item.name === "Sam" && item.link!="" && item.message !="I do not understand..."))
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message +'<a href="'+item.link+'" class="link-success" target= "_blank"> Click Here </a>' + '</div>'
            }
            else if (item.name === "Default" || item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else if(item.name === "DefaultTags"){
                console.log("Tags");
                if (item.check=="msg") {
                    html += '<div class="messages__item messages__item--visitor">' + item.message +'<a href="'+item.link+'" class="link-success" target= "_blank"> Click Here </a>' + '</div>'
                } else {
                
                html += '<div class="greeting" id="main"> <ul class="list">'
                let tagsarray=item.tags.split("|");
                let tagsidarray=item.tagsid.split("|");
                for(let i=0;i<tagsarray.length;i++){
                    console.log("Tags");
                    html += '<li id ='+tagsidarray[i]+' class="list-l" ><button type="button" class="btn btn-outline-secondary">'+tagsarray[i]+'</button></li>'
                }
                html +='</ul> </div>'    
            }
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;

        this.messages.slice().reverse().forEach((item, index)=> {
            if(item.name === "DefaultTags"){
                console.log("Tags");
                let tagsidarray=item.tagsid.split("|");
                let tagsarray=item.tags.split("|");
                for(let i=0;i<tagsidarray.length;i++){

                    let chattag = document.getElementById(tagsidarray[i]);
                    let text1=tagsidarray[i];
                    let text2=tagsarray[i];
                    
                    chattag.addEventListener('click',() => {
                        
                        let msg1 = { name: "User", message: text2 }
                        this.messages.push(msg1);

                        var textField = chatbox.querySelector('input');
                        fetch('http://127.0.0.1:5000/tags', {
                        method: 'POST',
                        body: JSON.stringify({ message: text1 }),
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        })
                        .then(r => r.json())
                        .then(r => {
                            if (r.check=="msg") {
                                let msg2 = { name: "Sam", message: r.answer ,link : r.link};
                                this.messages.push(msg2);
                            } else {
                                let msg2 = { name: "DefaultTags", tags : r.tag,tagsid : r.tagid};
                                this.messages.push(msg2);
                            }
                            this.updateChatText(chatbox)
                            textField.value = ''
                        }).catch((error) => {
                            console.error('Error:', error);
                            this.updateChatText(chatbox)
                            textField.value = ''
                        });
                    });
                }
            }
        });

        // if (firstTime) {
        //     chatBox.scrollTop = chatBox.scrollHeight;
        //     firstTime = false;
        //   } else if (chatBox.scrollTop + chatBox.clientHeight === chatBox.scrollHeight) {
            // chatBox.scrollBottom = chatBox.scrollHeight;
        //   }
    }
}


const chatbox = new Chatbox();
chatbox.display();