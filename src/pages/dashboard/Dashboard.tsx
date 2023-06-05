import { Typography } from '@mui/material';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { FerramentasDaListagem } from '../../shared/components';


export const Dashboard = () => {

  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
      barraDeFerramentas={(
        <FerramentasDaListagem />
      )}
    >
      <Typography>
        Coisas da Página Dashboard
      </Typography>
        
    </LayoutBaseDePagina>
  );
};