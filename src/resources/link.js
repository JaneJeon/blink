import React from 'react'
import {
  List as DataList,
  Datagrid,
  //   ReferenceField,
  DateField,
  UrlField,
  Show as SingleShow,
  SimpleShowLayout,
  TextField,
  RichTextField
} from 'react-admin'
import Typography from '@material-ui/core/Typography'

const LinkTitle = ({ record }) => {
  return <span>{record.originalUrl || ''}</span>
}

export const List = props => (
  <DataList {...props}>
    <Datagrid rowClick="show">
      <UrlField source="originalUrl" label="Original URL" sortable={false} />
      <UrlField source="shortenedUrl" label="Shortened URL" sortable={false} />
      <UrlField source="brandedUrl" label="Branded URL" sortable={false} />
      {/* <ReferenceField source="creatorId" reference="users" label="Created by">
        <TextField source="name" />
      </ReferenceField> */}
      <DateField source="createdAt" label="Created at" />
      <DateField source="updatedAt" label="Updated at" />
    </Datagrid>
  </DataList>
)

export const Show = props => (
  <SingleShow title={<LinkTitle />} {...props}>
    <SimpleShowLayout>
      <Typography variant="h6">Shortened link information</Typography>
      <UrlField source="shortenedUrl" label="Shortened URL" />
      <UrlField source="brandedUrl" label="Branded URL" />
      {/* <ReferenceField source="creatorId" reference="users" label="Created by">
        <TextField source="name" />
      </ReferenceField> */}
      <DateField source="createdAt" label="Created at" />
      <DateField source="updatedAt" label="Updated at" />

      <Typography variant="h6">Original link information</Typography>
      <UrlField source="originalUrl" label="Original URL" />
      <TextField source="meta.title" label="Title" />
      <RichTextField source="meta.description" label="Description" />
      <TextField source="meta.author" label="Author" />
      <TextField source="meta.publisher" label="Publisher" />
      <TextField source="meta.lang" label="Language" />
      <DateField source="meta.date" label="Created at" />
    </SimpleShowLayout>
  </SingleShow>
)
