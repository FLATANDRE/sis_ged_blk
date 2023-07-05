import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import React from "react";

export function Footer({ brandName, brandLink}) {
  const year = new Date().getFullYear();
  const [showModal, setShowModal] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalText, setModalText] = React.useState('');

  const about = () =>{
    setModalTitle('Sobre o sistema');
    setModalText('Sistema experimental para o projeto de TCC na pós-graduação em Arquitetura de Sistema Distribuídos. Desenvolvido por André Santana.');
    setShowModal(true);
  }

  const license = () =>{
    setModalTitle('Licença');
    setModalText('Sistema desenvolvido sobre a licença de software livre GNU GPL.');
    setShowModal(true);
  }

  return (

    <>
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
                    {modalTitle}
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
                    {modalText}
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>                  
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, feito por {" "}
          {brandName}.
        </Typography>
        <ul className="flex items-center gap-4">
            <li key={'about'} onClick={about}>
              <Typography
                as="a"           
                href="#"     
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {'Sobre o sistema'}
              </Typography>
            </li>
            <li key={'license'} onClick={license}>
              <Typography
                as="a"
                href="#"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {'Licença'}
              </Typography>
            </li>            
        </ul>
      </div>
    </footer>
    </>
  );
}

Footer.defaultProps = {
  brandName: "André Santana",
  brandLink: "#",  
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
