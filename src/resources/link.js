import {
  List as DataList,
  Datagrid,
  ReferenceField,
  DateField,
  UrlField,
  Show as ShowHOC,
  Edit as EditHOC,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  RichTextField,
  TextInput,
  DateTimeInput
} from 'react-admin'
import Typography from '@material-ui/core/Typography'
import validator from '../providers/validator'
import schema from '../schema.json'

export const List = props => (
  <DataList {...props}>
    <Datagrid rowClick="show">
      <UrlField source="originalUrl" label="Original link" sortable={false} />
      <UrlField source="shortenedUrl" label="Short link" sortable={false} />
      <UrlField source="brandedUrl" label="Brand link" sortable={false} />
      <ReferenceField source="creatorId" reference="users" label="Created by">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="createdAt" label="Created at" />
      <DateField source="updatedAt" label="Updated at" />
    </Datagrid>
  </DataList>
)

export const Show = props => (
  <ShowHOC {...props}>
    <SimpleShowLayout>
      <Typography variant="h6">Shortened link information</Typography>
      <UrlField source="shortenedUrl" label="Short link" />
      <UrlField source="brandedUrl" label="Brand link" />
      <ReferenceField source="creatorId" reference="users" label="Created by">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="createdAt" label="Created at" />
      <DateField source="updatedAt" label="Updated at" />

      <Typography variant="h6">Original link information</Typography>
      <UrlField source="originalUrl" label="Original URL" />
      <TextField source="meta.title" label="Title" />
      <RichTextField source="meta.description" label="Description" />
      <TextField source="meta.author" label="Author" />
      <TextField source="meta.publisher" label="Publisher" />
      <TextField source="meta.lang" label="Language" />
      <DateField source="meta.date" label="Original link created at" />
    </SimpleShowLayout>
  </ShowHOC>
)

export const Edit = props => (
  <EditHOC {...props}>
    <SimpleForm
      submitOnEnter={false}
      warnWhenUnsavedChanges
      validate={validator('Link')}
    >
      <TextInput
        disabled={schema.Link.properties.originalUrl.readOnly}
        source="originalUrl"
        label="Original Link"
        tyle="url"
      />
      <TextInput
        disabled={schema.Link.properties.shortenedUrl.readOnly}
        source="shortenedUrl"
        label="Short Link"
        type="url"
      />
      <TextInput
        disabled={schema.Link.properties.brandedUrl.readOnly}
        source="brandedUrl"
        label="Brand Link"
        type="url"
      />

      <TextInput
        disabled={schema.Link.properties.meta.properties.title.readOnly}
        source="meta.title"
        label="Title"
      />
      <TextInput
        disabled={schema.Link.properties.meta.properties.description.readOnly}
        multiline
        source="meta.description"
        label="Description"
      />
      <TextInput
        disabled={schema.Link.properties.meta.properties.author.readOnly}
        source="meta.author"
        label="Author"
      />
      <TextInput
        disabled={schema.Link.properties.meta.properties.publisher.readOnly}
        source="meta.publisher"
        label="Publisher"
      />
      <TextInput
        disabled={schema.Link.properties.meta.properties.lang.readOnly}
        source="meta.lang"
        label="Language"
      />
      <DateTimeInput
        disabled={schema.Link.properties.meta.properties.date.readOnly}
        source="meta.date"
        label="Original link created at"
      />
    </SimpleForm>
  </EditHOC>
)
