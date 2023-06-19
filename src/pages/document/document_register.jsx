import { useState } from "react";
import formDocument from './document_form';
import hashFile from "./document_hash";
import { getEthAccounts } from "../auth/authWallet";

export function DocumentRegister() {  
    const accounts = getEthAccounts();
    const [docInfo,setDocInfo] = useState('');
    const [docName,setDocName] = useState('');
    const docCID = '';
    const [fileUpload,setFile] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        formDocument.user = accounts[0];
        formDocument.docInfo = docInfo;

        if (fileUpload) formDocument.docName = fileUpload.name;

        //calcular o hash documento
        formDocument.docHash = await hashFile(fileUpload);     
        if (!formDocument.docHash) {
            console.error('File hash not calculated');
            return;
        }
              
        //enviar documento para o IPFS
       
        //enviar as informações para o contrato

        //enviar info para api metadata
        
        console.log(formDocument);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div class="space-y-12">
                <div class="border-b border-gray-900/10 pt-10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">Registro de documentos</h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">Arquivos podem ser armazenados utilizando este formulário. Preencha as informações.</p>

                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                   
                    <div class="col-span-full">
                    <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Informações sobre o documento</label>
                    <div class="mt-2">
                        <textarea id="about" name="about"  value={docInfo} onChange={(e) => setDocInfo(e.target.value) }  rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                    </div>
                    <p class="mt-3 text-sm leading-6 text-gray-600">Escreva informações relevantes que ajudem a identificar o documento.</p>
                    </div>
                   
                    <div class="col-span-full">
                    <label for="file-upload" class="block text-sm font-medium leading-6 text-gray-900">Documento</label>
                    <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div class="text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                        </svg>
                        <div class="mt-4 flex text-sm leading-6 text-gray-600">
                            <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Clique aqui e selecione o arquivo</span>
                            <input id="file-upload" name="file-upload" type="file" onChange={onFileChange} class="sr-only" />
                            </label>
                            <p class="pl-1"> ou arraste para esta área.</p>
                        </div>
                        <p class="text-xs leading-5 text-gray-600">DOC ou PDF de até 2MB</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                
            </div>

            <div class="mt-6 flex items-center justify-start gap-x-6">
                <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancelar</button>
                <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Salvar</button>
            </div>
        </form>
    );
}

export default DocumentRegister;