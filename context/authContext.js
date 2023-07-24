import React,{createContext,useState} from 'react';


export const AuthContext = createContext({storedCredentials:{}, setStoredCredentials:()=>{}, storedDCredentials:{}, setStoredDCredentials:()=>{}});
