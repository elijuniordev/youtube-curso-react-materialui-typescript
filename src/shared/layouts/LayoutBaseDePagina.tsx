import { AppBar, Box, IconButton, Theme, Toolbar, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useDrawerContext } from '../contexts';

interface ILayoutBaseDePaginaProps {
  titulo: string;
  children: ReactNode;
  barraDeFerramentas?: ReactNode;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({
  children,
  titulo,
  barraDeFerramentas,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const { toggleDrawerOpen } = useDrawerContext();
  
  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      gap={1}
    >
      <Box height={theme.spacing(smDown ? 8 : mdDown ? 9 : 10)}>
        <AppBar position="static">
          <Toolbar>
            {smDown && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography 
              variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
              whiteSpace='nowrap'
              overflow='hidden'
              textOverflow='ellipsis'
              sx={{ flexGrow: 1 }}
            >
              {titulo}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      {barraDeFerramentas && (
        <Box

        >
          {barraDeFerramentas}
        </Box>
      )}

      <Box
        flex={1}
        overflow='auto'
      >
        {children}
      </Box>

    </Box>
  );
};
