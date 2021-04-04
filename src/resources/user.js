import {
  List as DataList,
  Datagrid,
  TextField,
  SelectField,
  SimpleShowLayout,
  SimpleForm,
  Show as ShowHOC,
  Edit as EditHOC,
  BooleanField,
  DateField,
  TextInput,
  BooleanInput,
  SelectInput
} from 'react-admin'

import schema from '../schema.json'

const roleChoices = schema.User.properties.role.enum.map(role => ({
  id: role,
  name: role
}))

export const List = props => (
  <DataList {...props}>
    <Datagrid rowClick="show">
      <TextField source="name" name="Name" sortable={false} />
      <SelectField
        source="role"
        name="Role"
        choices={roleChoices}
        sortable={false}
      />
      <BooleanField source="deactivated" label="Deactivated" />
    </Datagrid>
  </DataList>
)

export const Show = props => (
  <ShowHOC {...props}>
    <SimpleShowLayout>
      <TextField source="name" label="Name" />
      <SelectField source="role" name="Role" choices={roleChoices} />
      <DateField source="createdAt" label="Created at" />
      <DateField source="updatedAt" label="Updated at" />
      <BooleanField source="deactivated" label="Deactivated" />
    </SimpleShowLayout>
  </ShowHOC>
)

export const Edit = props => (
  <EditHOC {...props}>
    <SimpleForm submitOnEnter={false} warnWhenUnsavedChanges>
      <TextInput source="name" name="Name" />
      <SelectInput
        source="role"
        name="Role"
        choices={roleChoices}
        sortable={false}
      />
      <BooleanInput source="deactivated" label="Deactivated" />
    </SimpleForm>
  </EditHOC>
)
