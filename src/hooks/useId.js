import {useState, useEffect} from 'react'

export default function useId(){
    const [id, setId] = useState('')
    useEffect(()=>{
        const id = localStorage.getItem('id')
        if (!id){
            setId('no_id')
        }
        else{
            setId(id)
        }
    }, [])
    return id
}