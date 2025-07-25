import { Outlet, useParams } from 'react-router-dom';

const EmpresaLayout = () => {
    const { empresaId } = useParams();

    return (
        <div>
            {/* Aquí podrías agregar un encabezado o una barra lateral específica de la empresa si lo necesitas */}
            <Outlet context={{ empresaId }} />
        </div>
    );
};

export default EmpresaLayout;
