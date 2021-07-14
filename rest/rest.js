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

const requestUrlPosts = 'https://jsonplaceholder.typicode.com/posts?_page=5&_limit=15',
      requestUrlPhotos = 'https://jsonplaceholder.typicode.com/photos?_page=7&_limit=20',
      requestUrlComments = 'https://jsonplaceholder.typicode.com/comments?_page=7&_limit=20', 
      requestUrlAlbums = 'https://jsonplaceholder.typicode.com/albums?_page=5&_limit=20'   
 
let i = 1;
function request(URL, i) {
    sendRequest('GET', URL)
        .then (data => data.forEach(item => {
            
            imgProgress.hidden = false;
            let table = document.querySelector('#table');
            let items = document.querySelectorAll('#pagination li');
            let pagination = document.querySelector('#pagination');
      
              let tr = document.createElement('tr');
                        table.appendChild(tr);
                       
                        if (item.url) {
                            createCell(item.title, tr);
                            createCell(item.url, tr);          //photos
                            createCell(item.thumbnailUrl , tr); 
                        } 
                        else 
                            if (item.title && item.body) {
                                createCell(item.title, tr);   //posts
                                createCell(item.body, tr);          
                            }
                            else
                                if (item.name) {
                                    createCell(item.name, tr);   //comments
                                    createCell(item.body, tr);
                                    createCell(item.email, tr); 
                                }    
                                else
                                    createCell(item.title, tr);  //albums
	    	        
               
            function createCell(text, tr) {     
                let td = document.createElement('td');
                td.innerHTML = text;
                tr.appendChild(td);
            }
        }))
        .catch(err => console.log(err)) 

   document.querySelector('#pagination').innerHTML = '';
   table.innerHTML = '';
}