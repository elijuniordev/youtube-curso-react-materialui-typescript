import { Typography } from '@mui/material';
import { LayoutBaseDePagina } from '../../shared/layouts';


export const Dashboard = () => {

  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
      barraDeFerramentas={<>Barra de ferramentas</>}
    >
      <Typography>
        Coisas da Página Dashboard
      </Typography>
        
    </LayoutBaseDePagina>
  );
};