import { ThemeOptions } from '@mui/material';

import colors from './colors';
import typography from './typography';

const overrides: ThemeOptions['components'] = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
    },
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
    },
    styleOverrides: {
      root: {
        width: 'fit-content',
        borderRadius: 5,
        fontWeight: 700,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&:active': {
          boxShadow: 'none',
        },
      },
      fullWidth: {
        width: '100%',
      },
      sizeSmall: {
        ...typography.body3,
        fontWeight: 700,
        padding: '4px 8px',
      },
      sizeMedium: {
        ...typography.body2,
        fontWeight: 700,
        padding: '6px 12px',
      },
      sizeLarge: {
        ...typography.body1,
        fontWeight: 700,
        padding: '10px 16px',
      },
      contained: {
        backgroundColor: colors.blue500,
        color: colors.white,
        '&:hover': {
          backgroundColor: colors.blue600,
        },
        '&:active': {
          backgroundColor: colors.blue700,
        },
        '&:disabled': {
          backgroundColor: colors.blue200,
          color: colors.blue300,
        },
      },
      containedSecondary: {
        backgroundColor: colors.blue50,
        color: colors.blue500,
        '&:hover': {
          backgroundColor: colors.blue100,
        },
        '&:active': {
          backgroundColor: colors.blue200,
        },
        '&:disabled': {
          backgroundColor: colors.blue50,
          color: colors.blue200,
        },
      },
      containedInfo: {
        backgroundColor: colors.white,
        color: colors.black950,
        '&:hover': {
          backgroundColor: colors.black100,
        },
        '&:active': {
          backgroundColor: colors.white,
          outline: `2px solid ${colors.blue500}`,
          outlineOffset: -2,
        },
        '&:disabled': {
          backgroundColor: colors.white,
          color: colors.black200,
        },
      },
      containedError: {
        backgroundColor: colors.red50,
        color: colors.red500,
        '&:hover': {
          backgroundColor: colors.red100,
        },
        '&:active': {
          backgroundColor: colors.red200,
        },
        '&:disabled': {
          backgroundColor: colors.red50,
          color: colors.red200,
        },
      },
      outlinedSecondary: {
        backgroundColor: colors.white,
        color: colors.black950,
        '&:hover': {
          backgroundColor: colors.black100,
        },
        '&:active': {
          backgroundColor: colors.blue50,
          color: colors.blue500,
        },
        '&:disabled': {
          backgroundColor: colors.blue200,
          color: colors.blue300,
        },
      },
      text: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&.MuiButton-sizeSmall': {
          padding: 0,
          ...typography.body1,
        },
        '&.MuiButton-sizeMedium': {
          padding: 0,
          ...typography.body1,
        },
        '&.MuiButton-sizeLarge': {
          padding: 0,
          ...typography.body1,
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        backgroundColor: colors.white,
        color: colors.black400,
        '&:hover': {
          backgroundColor: colors.black100,
          color: colors.black600,
        },
        '&:active': {
          backgroundColor: colors.black200,
          color: colors.black900,
        },
        '@media (hover: none) and (pointer: coarse)': {
          '&:hover': {
            backgroundColor: colors.white,
            color: colors.black400,
          },
          '&:active': {
            backgroundColor: colors.black200,
            color: colors.black900,
            transform: 'scale(0.98)',
          },
        },
      },
      sizeSmall: {
        width: 28,
        height: 28,
      },
      sizeMedium: {
        width: 34,
        height: 34,
      },
      sizeLarge: {
        width: 42,
        height: 42,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        backgroundColor: colors.white,
        overflow: 'hidden',
        '& .MuiSvgIcon-root': {
          color: colors.black200,
        },

        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.black500,
          },
          '& .MuiSvgIcon-root': {
            color: colors.black400,
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            borderColor: colors.blue500,
          },
          '& .MuiSvgIcon-root': {
            color: colors.black400,
          },
          '& .MuiOutlinedInput-input': {
            color: colors.black950,
          },
        },
        '&.Mui-disabled': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.black200,
          },
          '& .MuiOutlinedInput-input': {
            color: colors.black200,
          },
          '& .MuiSvgIcon-root': {
            color: colors.black200,
          },
        },
      },
      input: {
        padding: 12,
        color: colors.black500,
      },
      notchedOutline: {
        borderColor: colors.black200,
      },
      multiline: {
        padding: 0,
        '& .MuiOutlinedInput-input': {
          padding: 12,
          minHeight: '147px',
          resize: 'none',
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: colors.black950,
        fontWeight: 600,
        ...typography.body1,
      },
    },
  },
  MuiContainer: {
    defaultProps: {
      maxWidth: false,
    },
    styleOverrides: {
      root: {
        paddingInline: 16,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        height: 'auto',
        width: 'fit-content',
        maxWidth: 'fit-content',
        borderRadius: 5,
        paddingBlock: 4,
      },
      label: {
        ...typography.body2,
        paddingInline: 8,
        overflow: 'visible',
      },
      outlinedSecondary: {
        ...typography.body1,
        paddingInline: 8,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: 0,
        '& > :not(style) ~ :not(style)': {
          marginLeft: 0,
        },
      },
    },
  },
  MuiSlider: {
    styleOverrides: {
      root: {
        height: 4,
        padding: '10px 0',
      },
      thumb: {
        height: 20,
        width: 20,
        backgroundColor: colors.white,
        border: `1px solid ${colors.black200}`,
        '&::before, &::after': {
          backgroundColor: 'rgba(217, 228, 255, 0.70) 100%)',
        },
      },
      track: {
        backgroundColor: colors.blue500,
        height: 4,
      },
      rail: {
        backgroundColor: colors.blue100,
      },
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        gap: 1,
        backgroundColor: colors.black100,
        '&:has(.MuiToggleButton-root:not(.Mui-selected):hover)': {
          backgroundColor: colors.black200,
        },
      },
      firstButton: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
      },
      lastButton: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        padding: 8,
        borderRadius: 5,
        border: 'none',
        backgroundColor: colors.black100,
        color: colors.black400,
        '&:hover': {
          backgroundColor: colors.black200,
          color: colors.black600,
        },
        '&.Mui-selected': {
          backgroundColor: colors.blue500,
          color: colors.white,
          '&:hover': {
            backgroundColor: colors.blue500,
            color: colors.white,
          },
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        ...typography.body2,
        lineHeight: '130%',
        color: colors.white,
        backgroundColor: colors.black950,
        padding: 12,
        borderRadius: 10,
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        padding: 8,
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      root: {
        padding: 0,
        '& .MuiOutlinedInput-root': {
          padding: 12,
          '& .MuiAutocomplete-input': {
            padding: 0,
          },
        },
        '& .MuiAutocomplete-tag': {
          backgroundColor: colors.black100,
          color: colors.black500,
          marginInline: 4,
          paddingBlock: 0,
          paddingInline: 12,
          borderRadius: '44px',

          '& .MuiChip-label': {
            paddingInline: 4,
          },

          '& .MuiChip-deleteIcon': {
            fontSize: 16,
            marginLeft: 4,
            color: colors.black400,
            '&:hover': {
              color: colors.black500,
            },
          },
        },
      },
      paper: {
        marginTop: 12,
        borderRadius: 10,
      },
      listbox: {
        padding: 16,
        '& .MuiAutocomplete-option': {
          padding: 8,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 4,
          '&:last-of-type': {
            marginBottom: 0,
          },
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        padding: 0,
        maxWidth: 'fit-content',
        maxHeight: '80vh',
        borderRadius: 12,

        '@media (max-width: 768px)': {
          maxHeight: '100%',
        },
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        paddingBlock: 12,
        paddingInline: 24,
        color: colors.black950,

        '@media (max-width: 768px)': {
          padding: 16,
        },
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        borderColor: colors.black200,
        padding: 24,

        '@media (max-width: 768px)': {
          padding: 16,
        },
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        paddingBlock: 16,
        paddingInline: 24,
        gap: 16,

        '@media (max-width: 768px)': {
          flexDirection: 'column',
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        width: 24,
        height: 24,
        fontWeight: 600,
        ...typography.body2,
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        '&.MuiDivider-root': {
          marginBlock: 16,
          borderColor: colors.black200,
        },
      },
    },
  },

  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
    },
  },
  MuiImageList: {
    styleOverrides: {
      root: {
        '&:nth-of-type(1)': {
          height: '418px',
        },
      },
    },
  },
  MuiImageListItem: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.black200,
        img: {
          transition: 'transform 225ms ease-in-out',
        },
        '&:hover': {
          img: {
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        '& .MuiTabScrollButton-root.Mui-disabled': {
          display: 'none',
        },
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        ...typography.body1,
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        padding: 0,
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 'auto',
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        ...typography.body1,
      },
    },
  },
  MuiAccordion: {
    defaultProps: {
      elevation: 0,
      disableGutters: true,
    },
    styleOverrides: {
      root: {
        padding: 0,
        border: `1px solid ${colors.black200}`,

        paper: {
          boxShadow: 'none',
        },

        '&:before': {
          display: 'none',
        },

        '&:first-of-type': {
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        },

        '&:last-of-type': {
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: '10px 14px 10px 24px',
        flexDirection: 'row',
      },
      content: {
        margin: 0,
      },

      expandIconWrapper: {
        '& .MuiIcon-root': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '0 14px 24px 24px',
        maxWidth: '644px',
      },
    },
  },
  MuiPaginationItem: {
    styleOverrides: {
      root: {
        borderRadius: 5,
        backgroundColor: colors.white,
        color: colors.black950,
        ...typography.body2,
        fontWeight: 700,
        '&:hover': {
          backgroundColor: colors.black100,
        },
        '&.Mui-selected': {
          backgroundColor: colors.blue500,
          color: colors.white,
        },
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        backgroundColor: colors.black100,
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        padding: 9,
      },
      thumb: {
        boxShadow: 'none',
        width: 14,
        height: 14,
        margin: 3,
        backgroundColor: colors.white,
      },
      track: {
        borderRadius: 11,
        backgroundColor: colors.black300,
        opacity: 1,
      },
      switchBase: {
        '&.Mui-checked + .MuiSwitch-track': {
          opacity: 1,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.6,
        },
      },
    },
  },
};

export default overrides;
