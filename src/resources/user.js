import React from 'react'
import {
  List as DataList,
  Datagrid,
  TextField,
  SelectField,
  SimpleShowLayout,
  Show as SingleShow,
  BooleanField,
  DateField
} from 'react-admin'

import schema from '../schema.json'

export const List = props => (
  <DataList {...props}>
    <Datagrid rowClick="show">
      <TextField source="name" name="Name" sortable={false} />
      <SelectField
        source="role"
        name="Role"
        choices={schema.User.properties.role.enum.map(role => ({
          id: role,
          name: role
        }))}
        sortable={false}
      />
      <BooleanField source="deactivated" label="Deactivated" />
    </Datagrid>
  </DataList>
)

export const Show = props => (
  <SingleShow {...props}>
    <SimpleShowLayout>
      <TextField source="name" label="Name" />
      <SelectField
        source="role"
        name="Role"
        choices={schema.User.properties.role.enum.map(role => ({
          id: role,
          name: role
        }))}
      />
      <DateField source="createdAt" label="Created at" />
      <DateField source="updatedAt" label="Updated at" />
      <BooleanField source="deactivated" label="Deactivated" />
    </SimpleShowLayout>
  </SingleShow>
)
