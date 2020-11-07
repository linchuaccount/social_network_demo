const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users"

const dataPanel = document.querySelector("#dataPanel")
const paginator = document.querySelector("#paginator")
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const users = JSON.parse(localStorage.getItem('likeUsers'))
const USER_PER_PAGE = 20

//刪除喜歡的users
function removeFromLike(id) {
  const userIndex = users.findIndex((user) => user.id === id)
  users.splice(userIndex, 1)
  localStorage.setItem('likeUsers', JSON.stringify(users))
  renderUserList(users)
}

//分頁資料切割(每頁20人)切割對象:陣列users
function getUserByPage(page) {

  const startIIndex = (page - 1) * 20

  return users.slice(startIIndex, startIIndex + USER_PER_PAGE)
}

//分頁產生器(總共200人會產生幾頁分頁)
function renderPaginator(userAmount) {
  //無條件進位 Math.ceil()
  const PagesAmount = Math.ceil(userAmount / USER_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= PagesAmount; page++) {
    rawHTML += `
  <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
  `
    paginator.innerHTML = rawHTML
  }
}

//modal監聽器 & addlike監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-user-info")) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-user-remove")) {
    removeFromLike(Number(event.target.dataset.id))
  }
})

//分頁監聽器
paginator.addEventListener('click', function paginatorClicked(event) {
  console.log('click')
  if (event.target.tagName !== 'A') return
  //帶入dataset.page，根據點擊的頁數獲得分頁切割資料
  const page = Number(event.target.dataset.page)
  renderUserList(getUserByPage(page))
  console.log('click')
})

//搜尋監聽器
searchForm.addEventListener('submit', function searchFormSubmitted(event) {
  event.preventDefault()
  const inputWords = searchInput.value.trim().toLowerCase()
  let filteredUsers = []
  if (!inputWords) {
    return alert('Please enter a valid string.')
  }
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(inputWords)
  )
  if (filteredUsers.length === 0) {
    return alert('No matching data is available to display.')
  }
  renderUserList(filteredUsers)
})

//moadal畫面
function showUserModal(id) {
  const modalBody = document.querySelector("#info-modal-body");
  axios.get(INDEX_URL + "/" + id).then((response) => {
    const data = response.data;
    modalBody.innerHTML = `
        <img class="card-img-top" src="${item.avatar}" alt="avatar">
        <p><b id="user-modal-name">${data.name} ${data.surname}</b></p>
        <p id="user-modal-email"><i class="far fa-envelope"></i> Email: ${data.email}</p>
        <p id="user-modal-gender"><i class="fas fa-venus-mars"></i> Gender: ${data.gender}</p>
        <p id="user-modal-age"><i class="fab fa-pagelines"></i> Age: ${data.age}</p>
        <p id="user-modal-region"><i class="fas fa-globe"></i> Region: ${data.region}</p>
        <p id="user-modal-birthday"><i class="fas fa-birthday-cake"></i> Birthday: ${data.birthday}</p>
`
  })
}

//主畫面函式
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
  
    <div class="col-md-3">
    <div class="mb-3 card-deck">
    <div class="card text-center border-dark box-shadow rounded-lg">
    <img class="card-img-top" src="${item.avatar}" alt="avatar">
    <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <button type="button" class="btn btn-primary btn-user-info" data-toggle="modal"   data-target="#user-info" data-id="${item.id}">
        more
        </button>
        <button type="button" class="btn btn-danger btn-user-remove" data-id="${item.id}">
        <i class="fas fa-user-minus btn-user-remove" data-id="${item.id}"></i>
        </button>
      </div>
    </div>
    </div>
  </div>
  `
    dataPanel.innerHTML = rawHTML;
  });
}

renderPaginator(users.length)
renderUserList(getUserByPage(1));