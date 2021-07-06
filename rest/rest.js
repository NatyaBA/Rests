window.onscroll = function() {myFunction()};

function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}

function sendRequest(method, url, post=null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url);
        xhr.responseType ='json';
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            }
            else {
            resolve(xhr.response);  
            }
        }    
        xhr.onrerror = () => {  
            reject(xhr.response);  
        }
        xhr.send(JSON.stringify(post));  
    })
}
const requestUrlPosts = 'https://jsonplaceholder.typicode.com/posts',
      requestUrlPhotos = 'https://jsonplaceholder.typicode.com/photos',
      requestUrlComments = 'https://jsonplaceholder.typicode.com/comments',
      requestUrlAlbums = 'https://jsonplaceholder.typicode.com/albums';

let i = 1;
function request(URL, i) {
    sendRequest('GET', URL)
        .then (data => data.forEach(item => {  
            let table = document.querySelector('#table');
            let pagination = document.querySelector('#pagination');
            
            let notesOnPage = 30;
            let countOfItems = Math.ceil(data.length / notesOnPage);
            
            let showPage = (function() {
                let active;
                
                return function(item) {
                    if (active) {
                        active.classList.remove('active');
                    }
                    active = item;
                    
                    item.classList.add('active');
                    
                    let pageNum = +item.innerHTML;
                    
                    let start = (pageNum - 1) * notesOnPage;
                    let end = start + notesOnPage;
                    
                    let notes = data.slice(start, end);
                    
                    table.innerHTML = '';
                    for (let note of notes) {
                        let tr = document.createElement('tr');
                        table.appendChild(tr);
                        if (note.url) {
                            createCell(note.title, tr);
                            createCell(note.url, tr);          //photos
                            createCell(note.thumbnailUrl , tr); 
                        } 
                        else 
                            if (note.title && note.body) {
                                createCell(note.title, tr);   //posts
                                createCell(note.body, tr);          
                            }
                            else
                                if (note.name) {
                                    createCell(note.name, tr);   //comments
                                    createCell(note.body, tr);
                                    createCell(note.email, tr); 
                                }    
                                else
                                    createCell(note.title, tr);  //albums            
	    	        }
                };
            }());
            
            let items = [];
            if (i != -1)
            for ( i = 1; i <= countOfItems; i++) {
                let li = document.createElement('li');
                li.innerHTML = i;
                pagination.appendChild(li);
                items.push(li);
                if (i==countOfItems) {
                   i = -1;
                   break;
                }
            }
            
            showPage(items[0]);
            
            for (item of items) {
                item.addEventListener('click', function() {
                    showPage(this);
                });
            }
            
            function createCell(text, tr) {
                let td = document.createElement('td');
                td.innerHTML = text;
                tr.appendChild(td);
            }            
        }))
        .catch(err => console.log(err)) 
        
        document.querySelector('#pagination').innerHTML = '';
     }