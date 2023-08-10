import { useState } from "react";
import formDocument from './document_form';
import hashFile from "./document_hash";
import { getEthAccounts } from "../auth/authWallet";
import { getIpfsClusterInstance } from "@/ipfs_mgmt/ipfs";
import apiDocMetadata from "@/api_sis_ged/api_doc_metadata/metadata";
import { getContractDocumentManagementInstance } from "@/contract_api/contract";

export function DocumentRegister() {  
    const accounts = getEthAccounts();
    const [docInfo,setDocInfo] = useState('');
    const [fileUpload,setFile] = useState(null);
    const [showModal,setShowModal] = useState(false);
    const [docName,setDocName] = useState('');
    const [modalMessage,setModalMessage] = useState('');
    const [loadingPercentage,setLoadingPercentage] = useState('');
    const [showLoading,setShowLoading] = useState(false);
    
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const clearForm = () => {
        setDocInfo('');
        setDocName(null);
        setFile(null);
    }

    const removeDocument = () => {
        setFile(null);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        formDocument.user = accounts[0];
        formDocument.docInfo = docInfo;

        const fileSize = fileUpload.size;
        const fileMb = fileSize / 1024 ** 2;

        if(fileMb > 2) {
            setModalMessage('O arquivo selecionado possui o tamanho maior que 2 MB. Por favor selecione outro arquivo.');
            setShowModal(true);
            return;
        }

        if (fileUpload) {
            formDocument.docName = fileUpload.name;
            setDocName(fileUpload.name);
        }

        setShowLoading(true);
        setLoadingPercentage('10%');
        //calcular o hash documento
        formDocument.docHash = await hashFile(fileUpload);     
        if (!formDocument.docHash) {
            setShowLoading(false);
            console.error('File hash not calculated');
            return;
        }

        setLoadingPercentage('30%');
              
        //enviar documento para o IPFS
        const ipfs = getIpfsClusterInstance();
        const { cid } = await ipfs.add(fileUpload);
        if (!cid) {
            setShowLoading(false);
            console.error('File upload to IPFS failed');
            return;
        } 
        formDocument.docCID = cid;
       
        setLoadingPercentage('40%');
        //TODO adicionar mensagem para o usuario verificar a wallet e permitir transação
        //TODO verificar se tem alguma forma de exibir a wallet para que o usuário permita a transação.


        //enviar as informações para o contrato
        let isStored = false;
        try {
            const DocumentManagementContract = await getContractDocumentManagementInstance();
            isStored = await DocumentManagementContract.storeDocument(formDocument.docHash,formDocument.docName,{ from : accounts[0]});
            setLoadingPercentage('80%');
        } catch (err) {
            setModalMessage('Houve um erro ao confirmar a transação na blcockchain.');
            setShowModal(true);
            setShowLoading(false);
            ipfs.unpin(cid);
            return;
        }

        if (isStored) {
            //enviar info para api metadata
            const {data} = await apiDocMetadata.post('/documentMetadata',JSON.stringify(formDocument));
            console.log(data);
        } else {
            setShowLoading(false);
            console.error('Failed to store document');
            return;
        }

        setLoadingPercentage('100%');
        setModalMessage(`O arquivo "${docName}" foi salvo com sucesso. Na opção Documentos, uma listagem com os arquivos incluídos poderá ser visualizada.`);
        setShowModal(true);
        setShowLoading(false);
        clearForm();       
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div class="space-y-12">
                    <div class="border-b border-gray-900/10 pt-10 pb-12">

                    <div className="text-white px-6 py-4 border-0 rounded relative mb-4 bg-indigo-500">
                        <span className="text-xl inline-block mr-5 align-middle">
                            <i className="fas fa-sharp fa-solid fa-circle-exclamation"  />
                        </span>
                        <span className="inline-block align-middle mr-8">
                            <b className="capitalize">Atenção!</b> Não enviar documentos com informações pessoais ou confidenciais, pois este é um sistema em fase de desenvolvimento!
                        </span>                        
                    </div>
                    <h2 class="text-base font-semibold leading-7 text-gray-900">Registro de documentos</h2>
                    <p class="mt-1 text-sm leading-6 text-gray-600">Arquivos podem ser armazenados utilizando este formulário. Preencha as informações.</p>
                    
                    {showLoading ? 
                        <div className="relative pt-1">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                                <div style={{ width: loadingPercentage }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                            </div>
                        </div>
                    : null}

                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    
                        <div class="col-span-full">
                        <label for="about" class="block text-sm font-medium leading-6 text-gray-900">Informações sobre o documento *</label>
                        <div class="mt-2">
                            <textarea id="about" name="about" disabled={showLoading}  value={docInfo} onChange={(e) => setDocInfo(e.target.value) }  rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                        </div>
                        <p class="mt-3 text-sm leading-6 text-gray-600">Escreva informações relevantes que ajudem a identificar o documento.</p>
                        </div>
                    
                        <div class="col-span-full">
                            <label for="file-upload" class="block text-sm font-medium leading-6 text-gray-900">Documento *</label>
                            
                            <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div class="text-center">

                                {!fileUpload ?
                                <>
                                <svg className="mx-auto h-14 w-14 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>                           
                                <div class="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                        <span>Clique aqui e selecione o arquivo</span>
                                        <input id="file-upload" name="file-upload" type="file" 
                                            disabled={showLoading}
                                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
                                            max
                                            onChange={onFileChange}                                     
                                        class="sr-only" />
                                    </label>
                                    <p class="pl-1"> ou arraste para esta área.</p>
                                </div>
                                <p class="text-xs leading-5 text-gray-600">DOC ou PDF de até 2MB</p>                                
                                </>
                                : null}

                                {fileUpload ?
                                    <>
                                        <svg className="mx-auto h-14 w-14 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                        <p class="text-xs leading-5 text-gray-600">O documento "{fileUpload.name}" foi selecionado.</p> 
                                        <button type="button" onClick={removeDocument} class="rounded-md mt-4 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Remover documento</button>
                                    </>   
                                : null}
                                </div>
                            </div>                            
                        </div>

                    </div>

                    <p class="mt-1 text-sm leading-6 text-gray-600">* Campos obrigatórios.</p>  
                    </div>                  
                </div>

                <div class="mt-6 flex items-center justify-start gap-x-6">
                    <button type="button" onClick={clearForm} disabled={showLoading} class="text-sm font-semibold leading-6 text-gray-900">Cancelar</button>
                    <button type="submit" disabled={showLoading | !fileUpload | docInfo === ''} class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Salvar</button>
                </div>
            </form>

            {showModal ? (
                <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div className="relative w-auto my-6 mx-auto max-w-sm">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-3xl font-semibold">
                            Gestão de Arquivo
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => setShowModal(false)}
                        >
                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                            </span>
                        </button>
                        </div>
                        {/*body*/}
                        <div className="relative p-6 flex-auto">
                        <p className="my-4 text-slate-500 text-lg leading-relaxed">
                            {modalMessage}                            
                        </p>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => setShowModal(false)}
                        >
                            Fechar
                        </button>                        
                        </div>
                    </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}

export default DocumentRegister;