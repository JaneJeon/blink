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
  SelectInput,
  usePermissions
} from 'react-admin'
import { subject } from '@casl/ability'

import schema from '../schema/files'
import validator from '../providers/validator'
import getJsonPath from '../utils/get-json-path'

const roleChoices = schema.User.properties.role.enum.map(role => ({
  id: role,
  name: role
}))

export const List = props => (
  <DataList {...props} perPage={15}>
    <Datagrid rowClick="show">
      <TextField source="name" name="Name" sortable={false} />
      <SelectField
        source="role"
        name="Role"
        choices={roleChoices}
        sortable={false}
      />
      <BooleanField source="deactivated" label="Deactivated" />
      <DateField source="createdAt" label="Created at" />
      <DateField source="updatedAt" label="Updated at" />
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
    <EditComponent />
  </EditHOC>
)

const EditComponent = props => {
  const { loading, permissions } = usePermissions()
  const resource = subject('User', props.record)

  return loading ? (
    <div>Loading...</div>
  ) : (
    <SimpleForm
      submitOnEnter={false}
      warnWhenUnsavedChanges
      validate={validator('User')}
      {...props}
    >
      <TextInput
        disabled={
          schemaAt('name').readOnly ||
          permissions.cannot('update', resource, 'name')
        }
        source="name"
        label="Name"
      />
      <SelectInput
        disabled={
          schemaAt('role').readOnly ||
          permissions.cannot('update', resource, 'role')
        }
        source="role"
        label="Role"
        choices={roleChoices}
        sortable={false}
      />
      <BooleanInput
        disabled={
          schemaAt('deactivated').readOnly ||
          permissions.cannot('update', resource, 'deactivated')
        }
        source="deactivated"
        label="Deactivated"
      />
    </SimpleForm>
  )
}
