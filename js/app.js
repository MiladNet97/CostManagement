/* -------------[ Classes ]-------------*/
// Everything related to the html
class Html {
  // Display every message on html
  showMessage(message, className) {
    // create div for show message
    const div = document.createElement('div');
    div.classList = `alert alert-${className} text-center flex-grow-1 mx-2 w-100 max-500`;
    div.appendChild(document.createTextNode(message));

    // access to message box for add message
    let messageBox = document.querySelector('#message__box');
    if (!messageBox.querySelector(`.alert-${className}`)) {
      messageBox.appendChild(div);
      // removing message after 3 second
      setTimeout(() => document.querySelector(`.alert-${className}`).remove(), 3000);
    }

  }

  // Display total budget & available budget on html
  showBudget(amount) {
    totalBudget.innerHTML = html.separate(amount);
    availableBudget.innerHTML = html.separate(amount);
  }

  // Display costs list on html
  addCosts(text, amount) {
    const box = document.createElement('div');
    box.classList = 'costs__list col-md-6'
    const div = document.createElement('div');
    div.className = 'bg-brand d-flex justify-content-between align-items-center text-break px-3 py-2 mb-3';
    div.innerHTML = `
    <div class="d-flex align-items-center">
      <span id="number"></span>
      <span>- ${text}</span>
    </div>
    <div class="d-flex align-items-center">
      <p class="p-2 pr-3 pl-3"><span>${html.separate(amount)}</span> تومان</p>
      <a class="remove__list mr-2" id="${count++}">&#x2715</a>
    </div>
    `
    box.appendChild(div)
    costsBox.appendChild(box)
    html.counterList()

    let costsObj = {
      text: text,
      amount: amount,
      id: count - 1
    }

    addCostsLS(costsObj)
  }

  // Adding the counter to the cost list
  counterList() {
    Array.from(costsBox.children).forEach((list, index) => {
      list.querySelector('#number').innerHTML = index + 1;
    });
  }

  // When calculating the budget, color is added to the alert box
  addColor(amount) {
    // If the total budget is less than 25%, the alert box changes to the danger color
    if (amount / 4 > html.separateRemove(availableBudget.innerHTML)) {
      availableBudget.parentElement.parentElement.classList.remove('alert-warning')
      availableBudget.parentElement.parentElement.classList.add('alert-danger')
      usedBudget.parentElement.parentElement.classList.remove('alert-warning')
      usedBudget.parentElement.parentElement.classList.add('alert-danger')
    } // If the total budget is less than 50%, the alert box changes to the warning color
    else if (amount / 2 > html.separateRemove(availableBudget.innerHTML)) {
      availableBudget.parentElement.parentElement.classList.remove('alert-success')
      availableBudget.parentElement.parentElement.classList.add('alert-warning')
      usedBudget.parentElement.parentElement.classList.remove('alert-success')
      usedBudget.parentElement.parentElement.classList.add('alert-warning')
    }
  }

  // When removing the cost list, the color is removed from the alert box
  removeColor(amount) {
    // If the total budget is more than 25%, the alert box changes to the success color
    if (amount / 2 < html.separateRemove(availableBudget.innerHTML)) {
      availableBudget.parentElement.parentElement.classList.add('alert-success')
      availableBudget.parentElement.parentElement.classList.remove('alert-warning')
      usedBudget.parentElement.parentElement.classList.add('alert-success')
      usedBudget.parentElement.parentElement.classList.remove('alert-warning')
    } // If the total budget is more than 50%, the alert box changes to the warning color
    else if (amount / 4 < html.separateRemove(availableBudget.innerHTML)) {
      availableBudget.parentElement.parentElement.classList.remove('alert-danger')
      availableBudget.parentElement.parentElement.classList.add('alert-warning')
      usedBudget.parentElement.parentElement.classList.remove('alert-danger')
      usedBudget.parentElement.parentElement.classList.add('alert-warning')
    }
  }

  // When the cost list is cleared, the color returns to the default state
  clearColor() {
    availableBudget.parentElement.parentElement.classList.remove('alert-danger')
    usedBudget.parentElement.parentElement.classList.remove('alert-danger')
    usedBudget.parentElement.parentElement.classList.remove('alert-warning')
    availableBudget.parentElement.parentElement.classList.remove('alert-warning')
    availableBudget.parentElement.parentElement.classList.add('alert-success')
    usedBudget.parentElement.parentElement.classList.add('alert-success')
  }

  // Adding separator to numbers
  separate(Number) {
    Number += '';
    Number = Number.replace(',', '');
    let x, y, z;
    x = Number.split('.');
    y = x[0];
    z = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(y))
      y = y.replace(rgx, '$1' + ',' + '$2');
    return y + z;
  }

  // Removing separator from numbers
  separateRemove(number) {
    number = number.replace(/,\s?/g, "");
    return Number(number)
  }

}

// Everything related to budget calculation 
class Budget {
  constructor(userBudget) {
    this.userBudget = userBudget;
  }

  // When the budget is added, it sends the total budget amount to html
  addBudget() {
    html.showBudget(this.userBudget);
  }

  // When adding cost, it calculates the available budget and the budget used
  subtractBudget(amount) {
    availableBudget.innerHTML = html.separate(html.separateRemove(availableBudget.innerHTML) - amount);
    usedBudget.innerHTML = html.separate(html.separateRemove(totalBudget.innerHTML) - html.separateRemove(availableBudget.innerHTML));
    html.addColor(html.separateRemove(totalBudget.innerHTML))

    // total budget added to local storage
    let totalObj = {
      total: html.separateRemove(totalBudget.innerHTML)
    }

    let budgetDetail = getBudgetLS();
    if (!budgetDetail[0]) {
      addBudgetLS(totalObj)
    }

    // available budget and budget used added to local storage
    let subtractObj = {
      available: html.separateRemove(availableBudget.innerHTML),
      used: html.separateRemove(usedBudget.innerHTML)
    }

    if (budgetDetail.length == 2) {
      budgetDetail[1].available -= amount
      budgetDetail[1].used = html.separateRemove(totalBudget.innerHTML) - html.separateRemove(availableBudget.innerHTML)
      localStorage.setItem("budget", JSON.stringify(budgetDetail));
    } else {
      addBudgetLS(subtractObj)
    }
  }

  // When removing cost, it calculates the available budget and the budget used
  removeBudget(event) {
    event.target.parentElement.parentElement.parentElement.remove()
    html.counterList()
    let price = html.separateRemove(event.target.previousElementSibling.firstChild.innerHTML);
    availableBudget.innerHTML = html.separate(html.separateRemove(availableBudget.innerHTML) + price);
    usedBudget.innerHTML = html.separate(html.separateRemove(usedBudget.innerHTML) - price);

    html.removeColor(html.separateRemove(totalBudget.innerHTML))
    removeCostLocalStorgae(html.separateRemove(event.target.parentElement.children[1].id))

    let getBudgetFromLS = getBudgetLS();
    getBudgetFromLS[1].available = html.separateRemove(availableBudget.innerHTML)
    getBudgetFromLS[1].used = html.separateRemove(usedBudget.innerHTML)
    localStorage.setItem("budget", JSON.stringify(getBudgetFromLS));
  }

  // Clearing the budget and cost list
  clearBudget(event) {
    event.preventDefault()
    if (confirm('همه هزینه ها حذف شوند؟')) {
      btnBudget.disabled = false;
      btnClear.disabled = true;
      totalBudget.innerHTML = 0;
      availableBudget.innerHTML = 0;
      usedBudget.innerHTML = 0;
      html.clearColor()
      while (costsBox.firstChild) {
        costsBox.firstChild.remove()
      }
      clearLocalStorgae()
    }
  }
}

/* -------------[ Variables ]-------------*/
let budgetForm = document.querySelector('#budget__form'),
  costsForm = document.querySelector('#costs__form'),
  userBudget = document.querySelector('#user__budget'),
  totalBudget = document.querySelector('#total__budget'),
  availableBudget = document.querySelector('#available__budget'),
  usedBudget = document.querySelector('#used__budget'),
  costsBox = document.querySelector('#costs__box'),
  btnBudget = document.querySelector('#btn__budget'),
  btnClear = document.querySelector('#btn__clear'),
  html = new Html(),
  count = 1,
  budget;


/* -------------[ Functiones ]-------------*/

// Get budget from localStorage
function getBudgetLS() {
  let budgetDetail, getFromLS = localStorage.getItem('budget');
  getFromLS ? budgetDetail = JSON.parse(getFromLS) : budgetDetail = []
  return budgetDetail
}

// Get costs from localStorage
function getCostsLS() {
  let costs, getFromLS = localStorage.getItem('costs');
  getFromLS ? costs = JSON.parse(getFromLS) : costs = []
  return costs
}

// Add budget to localStorage 
function addBudgetLS(budget) {
  let budgetDetail = getBudgetLS();
  budgetDetail.push(budget)
  localStorage.setItem('budget', JSON.stringify(budgetDetail))
}

// Add costs to localStorage 
function addCostsLS(budget) {
  let costs = getCostsLS();
  costs.push(budget)
  localStorage.setItem('costs', JSON.stringify(costs))
}

// Remove costs from localStorage 
function removeCostLocalStorgae(costId) {

  // get costs from localStorage
  const getCostsFromLS = getCostsLS();

  getCostsFromLS.forEach((cost, index) => {
    if (cost.id === costId) {
      getCostsFromLS.splice(index, 1)
    }
  });

  // set new array of notes to the local storge
  localStorage.setItem('costs', JSON.stringify(getCostsFromLS));
}

// Clearing the budget and cost list from localStorage
function clearLocalStorgae() {
  localStorage.removeItem('costs', 'budget');
  localStorage.removeItem('budget');
}

// Showing budget and cost list from localStorage when document loaded
function localStorageOnload() {
  let getBudgetFromLS = getBudgetLS(),
    getCostsFromLS = getCostsLS();

  if (getBudgetFromLS.length == 2) {
    totalBudget.innerHTML = html.separate(getBudgetFromLS[0].total);
    availableBudget.innerHTML = html.separate(getBudgetFromLS[1].available);
    usedBudget.innerHTML = html.separate(getBudgetFromLS[1].used)
    btnClear.disabled = false;
    btnBudget.disabled = true;
  }

  getCostsFromLS.forEach(item => {
    const box = document.createElement('div');
    box.classList = 'costs__list col-md-6'
    const div = document.createElement('div');
    div.className = 'bg-brand d-flex justify-content-between align-items-center text-break px-3 py-2 mb-3';
    div.innerHTML = `
    <div class="d-flex align-items-center">
      <span id="number"></span>
      <span>- ${item.text}</span>
    </div>
    <div class="d-flex align-items-center">
      <p class="p-2 pr-3 pl-3"><span>${html.separate(item.amount)}</span> تومان</p>
      <a class="remove__list mr-2" id="${item.id}">&#x2715</a>
    </div>
    `
    box.appendChild(div)
    costsBox.appendChild(box)
    html.counterList()

  })

  html.addColor(html.separateRemove(totalBudget.innerHTML))
}

/* -------------[ Event Listeners ]-------------*/
budgetForm.addEventListener('submit', e => {
  e.preventDefault();
  budget = new Budget(userBudget.value)
  if (userBudget.value !== '') {
    budget.addBudget()
    budgetForm.reset()
    html.showMessage('بودجه با موفقیت اضافه شد', 'success');
    btnClear.disabled = false;
    btnBudget.disabled = true;
  } else {
    html.showMessage('لطفا مقدار بودجه خود را وارد کنید', 'danger');
  }
})

costsForm.addEventListener('submit', e => {
  e.preventDefault();
  const costName = document.querySelector('#cost__name').value,
    costAmount = document.querySelector('#cost__amount').value;
  budget = new Budget(userBudget.value)
  if (totalBudget.innerHTML == 0) {
    html.showMessage('لطفا بودجه خود را وارد کنید', 'danger')
  } else if (costName.trim() === '' || costAmount === '') {
    html.showMessage('لطفا همه مقادیر را وارد کنید', 'danger')
  } else {
    html.showMessage('هزینه با موفقیت اضافه شد', 'success')
    html.addCosts(costName, costAmount);
    budget.subtractBudget(costAmount);
    costsForm.reset()
  }
})

costsBox.addEventListener('click', e => {
  if (e.target.classList.contains('remove__list')) {
    budget = new Budget(userBudget.value)
    budget.removeBudget(e)
  }
})

btnClear.disabled = true;
btnClear.addEventListener('click', e => {
  budget = new Budget()
  budget.clearBudget(e)
})

document.addEventListener('DOMContentLoaded', localStorageOnload)