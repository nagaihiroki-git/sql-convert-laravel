import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import pluralize from 'pluralize';
function App() {
    const [sql, setSql] = useState('');
    const [result, setResult] = useState('');
    const setSqlValue = (e: any) => {
        setSql(e.target.value);
    }
   const snake2UpperCamel=(str:string):string=> {
        const camelStr=str.split('_').map(function(w,i){
            if (i === 0) return w.toLowerCase();
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }).join('');
        return camelStr.charAt(0).toUpperCase() + camelStr.slice(1);
    }
    const plural2Singular=(str:string):string=> pluralize.singular(str)
    const convertToLaravelSeed = () => {
        const tableName = sql.split('`')[1];
        const columns = sql.substring(sql.indexOf(tableName) + tableName.length).split('`').filter((v, i) => !v.includes(',') && !v.includes(')') && !v.includes('(') && v.length > 0);
        const values = sql.substring(sql.indexOf('VALUES') + 6).split('),').map(v => v.replace('(', '').replace(')', '').replace(';', '').split(',').map(v => v.trim()));
        const res=values.map((va,i)=>{
            const row=(plural2Singular(snake2UpperCamel(tableName))+'::create(['+va.map((v,i)=>columns[i]+"=>"+v)+']);');
            return row;
        }).join('\n');
        setResult(res);
    }
    const texts = result.split("\n").map((item, index) => {
        return (
            <React.Fragment key={index}>{item}<br /></React.Fragment>
        );
    });
    
    return (
        <div>
            <div>
                <input type="textArea" className={'textArea'} value={sql} onChange={setSqlValue}/>
            </div>
            <div>
                <button className={'button'} onClick={convertToLaravelSeed}>Convert</button>
            </div>
            <div>
                {texts}
            </div>
        </div>
    );
}

export default App;
