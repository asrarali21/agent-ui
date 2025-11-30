"use client"
import axios from "axios";
import { useState } from "react";


export default function Home() {
     
  const [input , setInput] = useState<string>(" ")
  const [messages , setMessages] = useState()
  const send = async()=>{
    const response = await axios.post("http://localhost:8000" , {input} , )
    console.log(response)
  }
 
     
  return (
   <div>

   <input type="text" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value )} 
    value={input}
    />
    <button onClick={send}>Send</button>
   </div>
  );
}
