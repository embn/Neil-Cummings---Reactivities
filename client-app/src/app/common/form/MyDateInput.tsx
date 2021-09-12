
import { useField } from 'formik';
import DatePicker, { ReactDatePickerProps} from 'react-datepicker';
import { Form, Label } from 'semantic-ui-react';

export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
    const [field, meta, helpers] = useField(props.name!);
    return (
        /* !! casts the string into a boolean */
        <Form.Field error={meta.touched &&  !!meta.error}>
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
}