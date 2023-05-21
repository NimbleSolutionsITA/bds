import {CheckboxProps as MuiCheckboxProps} from "@mui/material/Checkbox/Checkbox";
import {
	Checkbox as MuiCheckbox,
	FormControlLabel,
	FormControlLabelProps,
	FormGroup,
	FormHelperText
} from "@mui/material";
import {CheckBoxSharp, CheckBoxOutlineBlankSharp} from "@mui/icons-material";

type CheckboxProps = {
	checkboxProps?: MuiCheckboxProps
	formControlLabelProps: Omit<FormControlLabelProps, 'control'>,
	helperText?: string,
}
const Checkbox = ({checkboxProps, formControlLabelProps, helperText}: CheckboxProps) => (
	<FormGroup>
		<FormControlLabel
			{...formControlLabelProps}
			control={(
				<MuiCheckbox
					{...checkboxProps}
					checkedIcon={<CheckBoxSharp />}
					icon={<CheckBoxOutlineBlankSharp />}
				/>
			)}
		/>
		{helperText && <FormHelperText>{helperText}</FormHelperText>}
	</FormGroup>
)
export default Checkbox;