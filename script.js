var text_files = {
    'module1.js': `if(/www\.lidl\.de\/de\/.*\/p\d+/.test(document.location.href)){
        Kameleoon.API.Core.runWhenConditionTrue(
        () => window.jQuery,
        () => {
            jQuery(document).ajaxComplete((event, xhr, settings) => {
                if (/\/de\/basket\/add/.test(settings.url)) {
                    const localDate = Kameleoon.API.Data.readLocalData('LIDL-DE-T79_CLICK'),
                        product_id = 'product_'+pageParams.erpNumber;
                    Kameleoon.API.Goals.processConversion(goals['[T79|DE] Basket_Amount'], 1);
                    if(localDate && localDate.indexOf(product_id) !== -1){
                        Kameleoon.API.Goals.processConversion(goals['[T79|DE] Add2Cart_Reco']);
                        writeLocalProductId('LIDL-DE-T79_ADD-TO-CARD',product_id);
                    }
                }
            });
        });
    }`,

    'module2.js': `function checkDateCart(){
        if(document.querySelector("#dynamic_tm_success_data").innerHTML !== 'var dynamic_tm_data = {}'){
            clearInterval(intervalID);
            go_next_stage();
        }
    }`,

    'module3.js': `function writeLocalProductId(localDateName, product_id) {
        if(Kameleoon.API.Data.readLocalData(localDateName)){
            var localDate = Kameleoon.API.Data.readLocalData(localDateName);
            if(localDate.indexOf(product_id) === -1){
                localDate.push(product_id);
                Kameleoon.API.Data.writeLocalData(localDateName, localDate, true);
            }        
        }else {
            Kameleoon.API.Data.writeLocalData(localDateName, [product_id], true);
        }
    }`,

    'module4.js': `function clearlocal(){
        if(Kameleoon.API.Data.readLocalData('LIDL-DE-T79_CLICK')){
            Kameleoon.API.Data.writeLocalData('LIDL-DE-T79_CLICK', '', false);
        }
        if(Kameleoon.API.Data.readLocalData('LIDL-DE-T79_ADD-TO-CARD')){
            Kameleoon.API.Data.writeLocalData('LIDL-DE-T79_ADD-TO-CARD', '', false);    
        }
    }`
};

var standart_code = `Kameleoon.API.Core.runWhenElementPresent('#secrecommend_also_clicked section', function(elements) {
    Kameleoon.API.Goals.processConversion(goals['[T79|DE] Reco_Fallback']);
}, 200);`;

var why_deleted;

function git_view_code(){
    git_code_script.value = text_files[document.querySelector('.gk-js__active').innerText];
}

function git_change_code(){
    text_files[document.querySelector('.gk-js__active').innerText] = git_code_script.value;
    BO_Kameleoon();
}

function new_files(name){
    text_files[name+'.js'] = standart_code;
    git_files.innerHTML += '<li class="gk-js">'+name+'.js</li>';
    BO_Kameleoon();
}

function BO_Kameleoon(){
    bo_code_all.innerHTML = '';
    module_items.innerHTML = '';

    Array.from(git_files.children).forEach(element => {
        bo_code_all.innerHTML += '<div class="bo-kameleoon__code-main__desc">//'+element.innerText+'</div>';
        bo_code_all.innerHTML += '<div style="padding-left: 15px;"><p style="margin-left: -15px;">(function () {</p>'+text_files[element.innerText].split('\n').join('<br>')+'<p style="margin-left: -15px;">}());<p></div>';

        module_items.innerHTML += '<div class="module__items"><div class="module__items__title"><div class="module__items__title__name">'+element.innerText+'</div><div class="choice__mains"><div class="choice__items">Copy</div><div class="choice__items">Deleted</div></div></div><div class="module__items__code" style="display:none">'+text_files[element.innerText].split('\n').join('<br>')+'</div>'
    });  
}

function who_is_show(){
    if(document.querySelector('.bo-kameleoon__structure-settings_active').innerText == 'All'){
        document.querySelector('.bo-kameleoon__code__modul').style.display = 'none';
        document.querySelector('.bo-kameleoon__code-main').style.display = 'block';
    }else{
        document.querySelector('.bo-kameleoon__code__modul').style.display = 'block';
        document.querySelector('.bo-kameleoon__code-main').style.display = 'none';
    }  
}

function search(){
    var titles_array = document.querySelectorAll('.module__items__title__name'),
    search_key = RegExp(input_search_modul.value);
    titles_array.forEach(element => {
        if(search_key.test(element.innerText)){
            element.parentNode.parentNode.style.display = 'block';
        }else{
            element.parentNode.parentNode.style.display = 'none';
        }
    });
}

input_search_modul.addEventListener('click', function(){
    search();
});

input_search_modul.addEventListener('keyup', function(){
    search();
});

deleted_openend.addEventListener('click', function(e){
    if(e.target.classList.contains('module__items__code_deleted')){
        deleted_openend.style.display = 'none';
    }
    if(e.target.classList.contains('deleted_vibor_bnt') && e.target.innerText == 'No'){
        deleted_openend.style.display = 'none';
    }
    if(e.target.classList.contains('deleted_vibor_bnt') && e.target.innerText == 'Yes'){
        deleted_openend.style.display = 'none';
    }  
});

module_items.addEventListener('click', function(e){
    var index_items = Array.from(module_items.children).indexOf(e.target.closest('.module__items'));
    var module__items__code = module_items.children[index_items].querySelector('.module__items__code');
    if(e.target.classList.contains('module__items__title__name')){
        if(module__items__code.style.display == 'none'){
            module__items__code.style.display = 'block';
        }else{
            module__items__code.style.display = 'none';
        } 
    }
    if(e.target.classList.contains('choice__items')){
        if(e.target.innerText == 'Copy'){
            navigator.clipboard.writeText(module__items__code.innerText);
            e.target.innerText = 'Coped!';
            setTimeout(function(){
                e.target.innerText = 'Copy';
            }, 500);
        }
        if(e.target.innerText == 'Deleted'){
            module__items__code.style.display = 'block';
            why_deleted = module_items.children[index_items].querySelector('.module__items__title__name').innerText;
            deleted_openend.style.display = 'flex';
            real_deleted.innerHTML += '<b>'+why_deleted+'</b>';
        }
    }
});

bo_structure_set.addEventListener('click', function(e){
    if(!e.target.classList.contains('bo-kameleoon__structure-settings_active') && e.target.classList.contains('kkks')){
        document.querySelector('.bo-kameleoon__structure-settings_active').classList.remove('bo-kameleoon__structure-settings_active');
        e.target.classList.add('bo-kameleoon__structure-settings_active');
        who_is_show();
    }
});

git_add_file.addEventListener('click', function(){
    if(git_name_file.value == ''){
        git_name_file.classList.add('git_input_error');
        git_name_file.value = 'Введите имя файла';
    }else{
        new_files(git_name_file.value);
        git_name_file.value = '';
    }
});

git_name_file.addEventListener('click', function(){
    if(git_name_file.classList.contains('git_input_error')){
        this.classList.remove('git_input_error');
        this.value = '';
    }
});

git_files.addEventListener('click', function(e){
    if(!e.target.classList.contains('gk-js__active') && e.target.classList.contains('gk-js')){
        document.querySelector('.gk-js__active').classList.remove('gk-js__active');
        e.target.classList.add('gk-js__active');
        git_file_name.innerText = e.target.innerText;
        git_view_code();
    }
});

git_code_script.addEventListener('keyup', function(){
    git_change_code();
});

git_view_code();

BO_Kameleoon();

who_is_show();
