const input_amount = document.getElementById('amount');
const expense = document.getElementById("expense") //inputNameExpense
const category = document.getElementById('category') //select Tag
const form = document.querySelector("form")

const expenseList = document.querySelector('ul')
const expensesQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")
//captura o evento de input
input_amount.oninput = () => {
// utilizando regex para o campo vir sempre com NUMEROS e não letras
  let value = input_amount.value.replace(/\D/g, '')
  //atualizar o input
    // input_amount.value = value

    //transforma valor em centavos
    value = Number(value)/ 100

    input_amount.value = formatCurrentBRL(value)


}

function formatCurrentBRL(value){
    value = value.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
    })

    return value
}

form.onsubmit = (e) => {
    e.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value, //nome da despesa
        category_id: category.value, //value do option
        category_name: category.options[category.selectedIndex].text, //nome do valor do option
        amount: input_amount.value, //value of inputAmount
        created_at: new Date(),
    }
    expenseAdd(newExpense)
}

function expenseAdd(newExpense){
    try{
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //cria icone categoria
        const expenseIcon = document.createElement('img')
        expenseIcon.setAttribute('src' , `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute('alt', newExpense.category_name)

        const expenseInfo = document.createElement('div')
        expenseInfo.classList.add('expense-info')
        const expenseName = document.createElement('strong')
        expenseName.textContent = newExpense.expense
        const expenseCategory = document.createElement('span')
        expenseCategory.textContent = newExpense.category_name



        //add as info do item
        expenseInfo.append(expenseName, expenseCategory)

        const exepenseAmout = document.createElement('span')
        exepenseAmout.classList.add('expense-amount')
        exepenseAmout.innerHTML = `
            <small>
                R$
            </small> ${newExpense.amount.toUpperCase().replace("R$", "")}
        `

        //remove bottom
        const removeIcon = document.createElement('img')
        removeIcon.classList.add('remove-icon')
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")


        expenseItem.append(expenseIcon, expenseInfo, exepenseAmout, removeIcon)
    


        expenseList.append(expenseItem)

        formClear()
        //atualiza items
        updateTotals()

    }
    catch (error){
        alert("não foi possivel acessar a lista de despesa")
        console.log(error)
    }
}

function updateTotals(){
    try {
        //retorna todos os filhos das ul// 
        const items = expenseList.children
    
        expensesQuantity.textContent = `${items.length} ${items.length  > 1 ? "despesas" : "despesa"}`
        
       

        let total = 0 
        for(item = 0; item < items.length; item++){
            const itemAmout = items[item]
            .querySelector(".expense-amount")
            //remover caracteres não numéricos e substitui a virgula pelo ponto
            let value = itemAmout.textContent.replace(/[^\d,]/g, '').replace(',','.')
           
            value = parseFloat(value)
             console.log(value)
            //verifica se é um numero válido
            if(isNaN(value)){
                return alert("valor não parece um número")
            }
            total+=value
        }

        const symbolBRL = document.createElement('small')
        symbolBRL.textContent = "R$"
        total = formatCurrentBRL(total).toUpperCase().replace('R$', '')


        expenseTotal.innerHTML = ""

        expenseTotal.append(symbolBRL, total)
    } catch (error) {
        console.log("error")
        alert("não foi possivel atualizar")
    }
}

//verifica a ul clicada
expenseList.addEventListener("click", function (e)  {
    //verifica se o item clicado contém a classe remove=icon
    if(e.target.classList.contains("remove-icon")){
        //pega a classe pai mais proxima
        const item = e.target.closest(".expense")
        item.remove()
    }
    updateTotals()
})

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}