document.getElementById('user').value = 'TAB_TSIW_OIP_USER TAB_TSIW6_OIP_USER'

function findTables() {
    const synonym_str = document.getElementById('synonym').value;
    synonym_list = synonym_str.split(' ')
    synonym_list = synonym_list.map(str=> str.trim())
    
    find_table = ''
    for(let i =0 ; i<synonym_list.length; i++){
      syn = synonym_list[i].split('.')
      find_table += ` select table_owner || '.' || table_name as name from all_synonyms where owner = '${syn[0]}' and synonym_name = '${syn[1]}'`
      if(i != synonym_list.length-1){
        find_table += ' union '
      }
    }
    find_table =  `select listagg(name, ' ') from ( ` + find_table + ` )`
    document.getElementById('findTableQuery').innerText = find_table;
}

function generateQuery() {
    const users_str = document.getElementById('user').value;  
    users = users_str.split(' ')

    const synonym_str = document.getElementById('synonym').value;
    synonym_list = synonym_str.split(' ')
    synonym_list = synonym_list.map(str=> str.trim())
    

    const tables = document.getElementById('tables').value;
    
    table_list = tables.length>1 ? tables.split(' '): []
    table_list = table_list.map(str=> str.trim())
    let objects_list = []
    for(let i = 0; i<table_list.length; i++){
      objects_list.push(table_list[i])
      if(table_list[i].slice(-5) == 'OT001'){
        objects_list.push(table_list[i].slice(0, -5) + 'OT002')
      }
      if(table_list[i].slice(-5) == 'OT002'){
        objects_list.push(table_list[i].slice(0, -5) + 'OT001')
      }
    }
    
    objects_list = [...synonym_list, ...objects_list]
    
    grant_access = ''
    
    for(let i = 0; i<users.length; i++){
      for(let j = 0; j<objects_list.length; j++){
        grant_access += `grant select on ${objects_list[j]} to ${users[i]}; \n`
      }
    }
    
    document.getElementById('generateQueryResult').innerText = grant_access;
}
