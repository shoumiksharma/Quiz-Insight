const body = document.querySelector("body");
const onclick = ()=>{
    body.classList.add("onclick");
    // body.classList.remove("cursor");
};
const onclick_up = ()=>{
    body.classList.remove("onclick");
    // body.classList.add("cursor");
};

body.addEventListener("mousedown", onclick );

body.addEventListener("mouseup", onclick_up );

const btn = document.querySelector(".btn");

btn.addEventListener("mousedown", ()=>{
    btn.classList.add("onclick", "btn-onclick");
    // btn.classList.remove("cursor");
});

btn.addEventListener("mouseup", ()=>{
    btn.classList.remove("onclick", "btn-onclick");
    // btn.classList.add("cursor");
});

btn.addEventListener("mouseleave", ()=>{
    btn.classList.remove("onclick", "btn-onclick");
    // btn.classList.add("cursor");
});



document.addEventListener("DOMContentLoaded" , () =>{
    const select = document.querySelector(".select");
    
    btn.addEventListener("click", ()=> {
        document.querySelector(".main").style.display = 'none';
        document.querySelector(".select").style.display = 'block';
        select.scrollIntoView({behavior: "smooth"})
    });
});




const fetch_categories = async () =>{
    const data = await fetch("https://opentdb.com/api_category.php");
    const categories = await data.json();
    
    let form_categories = document.querySelector("#category");
    let keys = Object.keys(categories);
    let select;
    for(let i = 0; i<categories[keys[0]].length; i++){
        const new_option = document.createElement("option");
        select = document.querySelector("select");
        new_option.textContent = categories[keys[0]][i].name;
        new_option.value = categories[keys[0]][i].id;
        if(i==0){
            new_option.selected = true;
        }
        select.append(new_option);
    }
    fetch_max();
}

const fetch_max = async () => {

    const difficulty = document.querySelector("#difficulty").value;
    // console.log(difficulty);

    const selected = document.querySelector("#category");
    const q_data = await fetch(`https://opentdb.com/api_count.php?category=${selected.value}`);
    // console.log(selected.value);
    let max_data = await q_data.json();
    // console.log(max_data);
    max_data = (max_data.category_question_count);
    let max = difficulty == "easy" ? max_data.total_easy_question_count :
                difficulty == "medium" ? max_data.total_medium_question_count :
                difficulty == "hard" ? max_data.total_hard_question_count :
                50;

    if(max > 50){
        max = 50;
    }
    // console.log(max);
                
    document.querySelector("#q_number").max = max;
}

// fetch_categories();

document.querySelector("#category").addEventListener("input" , fetch_max);
document.querySelector("#difficulty").addEventListener("input" , fetch_max);


let quiz_data;
const fetch_data = async () =>{

    let q_no = document.querySelector("#q_number").value;
    let category = document.querySelector("#category").value;
    let difficulty = document.querySelector("#difficulty").value;
    
    quiz_data = await fetch(`https://opentdb.com/api.php?amount=${q_no}&category=${category}&difficulty=${difficulty}&type=multiple`);
    
    quiz_data = await quiz_data.json();
    console.log(quiz_data);
}

// fetch_data();

const get_data = async () => {
    await fetch_categories();
}

get_data();

document.querySelector(".button").addEventListener("click" , (event) => {
    event.preventDefault();
} );
// document.querySelector(".button").addEventListener("click" , fetch_data);
document.querySelector(".button").addEventListener("click" , async () =>{
    
    await fetch_data();
    document.querySelector(".select").style.display = 'none';
    document.querySelector(".question-panel").style.display = 'block';

    document.body.classList.add("align");
    await render_ques(0);
});


let score = 0;
let question_tab = document.querySelector("legend");
let option_tab = document.querySelector(".option-tab");
let currentQuestion = 0;
let index;
const render_ques = async (currentQuestion) =>{
    console.log(currentQuestion);
    let object = quiz_data.results[currentQuestion];
    question_tab.innerHTML = object.question;
    index = Math.floor((Math.random()*4));
    let options = [ ...object.incorrect_answers.slice(0,index) , object.correct_answer , ...object.incorrect_answers.slice(index)];
    for(let i = 0; i<4; i++){
        let answer_option = document.createElement("input");
        answer_option.type = "radio";
        answer_option.name = "answer";
        answer_option.value = i;
        answer_option.id = options[i];
        answer_option.style.cursor = `url("icons8-select-cursor-96.png") , auto`;
        answer_option.classList.add("box");

        let label = document.createElement("label");
        label.setAttribute('for' , options[i]);
        label.innerHTML = options[i];
        label.style.cursor = `url("icons8-select-cursor-96.png") , auto`;

        let div = document.createElement("div");
        div.append(answer_option);
        div.append(label);

        option_tab.append(div);
    }


    if(!document.querySelector(".next")){

        next = document.createElement("button");
        next.innerText = "NEXT";
        next.classList.add("next");
        document.querySelector(".nxt-btn").append(next);

        next.addEventListener("click" , update_score );
    }


}


const update_score = ()=> {
    let selected = document.querySelector('input[name="answer"]:checked');

    if(selected != null && selected.value == index){
        score++;
    }

    option_tab.innerHTML = "";
    // console.log(quiz_data.results.length);
    currentQuestion = currentQuestion + 1;
    
    if(currentQuestion < quiz_data.results.length){

        render_ques(currentQuestion);

    }
    else{

        question_tab.innerHTML = "";
        question_tab.style.display = "none";
        next.style.display = "none";
        option_tab.style.display = 'block';
        option_tab.innerHTML = `<h1> Your Score : ${score} </h1>`;

        let new_quiz;
        if(!document.querySelector("#new")){
            new_quiz = document.createElement("button");
            new_quiz.classList.add("next");
            new_quiz.innerText = "Try Again";
            new_quiz.classList.add("next-btn");
            new_quiz.setAttribute("id" , "new");
            // new_quiz.classList.add("next");
            // new_quiz.style.margin = "auto";

            new_quiz.addEventListener("click" , ()=> {
                document.querySelector(".question-panel").style.display = "none";
                question_tab.style.display ='block';
                next.style.display = 'block';
                option_tab.innerHTML = "";
                new_quiz.style.display = "none";
                score = 0;
                currentQuestion = 0;
                document.querySelector(".select").style.display = 'block';
            });
            option_tab.append(new_quiz);
        }

        new_quiz.style.display = 'block';
        

    }
}