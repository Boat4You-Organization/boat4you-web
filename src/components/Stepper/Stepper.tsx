import { Box, Stepper as MuiStepper, Stack, Step, StepLabel, Typography } from '@mui/material';

import Check from '@/components/SvgIcons/Check';
import colors from '@/styles/themes/colors';

interface StepperProps {
  activeStep: number;
  steps: string[];
}

const Stepper = ({ activeStep, steps }: StepperProps) => (
  <Box>
    <MuiStepper activeStep={activeStep} connector={null} sx={{ gap: 1 }}>
      {steps.map((label, index) => {
        const isActive = activeStep >= index;
        const isCompleted = index < activeStep;

        return (
          <Step key={label} sx={{ width: { xs: 86, md: 120 }, px: 0 }}>
            <StepLabel slotProps={{ stepIcon: { sx: { display: 'none' } } }}>
              <Stack gap={1.5}>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  sx={{
                    color: isActive ? colors.blue500 : colors.blue100,
                  }}
                >
                  {isCompleted ? <Check /> : `${index + 1}.`} {label}
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    height: 6,
                    backgroundColor: isActive ? colors.blue500 : colors.blue100,
                    borderRadius: 4,
                  }}
                />
              </Stack>
            </StepLabel>
          </Step>
        );
      })}
    </MuiStepper>
  </Box>
);

export default Stepper;
