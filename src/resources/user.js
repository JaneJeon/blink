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
import getJsonPath from '../utils/get-json-path'

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

const schemaAt = getJsonPath('User')

export const Edit = props => (
  <EditHOC {...props}>
    <SimpleForm submitOnEnter={false} warnWhenUnsavedChanges>
      <TextInput
        disabled={schemaAt('name').readOnly}
        source="name"
        name="Name"
      />
      <SelectInput
        disabled={schemaAt('role').readOnly}
        source="role"
        name="Role"
        choices={roleChoices}
        sortable={false}
      />
      <BooleanInput
        disabled={schemaAt('deactivated').readOnly}
        source="deactivated"
        label="Deactivated"
      />
    </SimpleForm>
  </EditHOC>
)
