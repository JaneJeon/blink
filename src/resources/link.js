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
import InputAdornment from '@material-ui/core/InputAdornment'
import validator from '../providers/validator'
import getJsonPath from '../utils/get-json-path'

export const List = props => (
  <DataList {...props}>
    <Datagrid rowClick="show">
      <UrlField source="originalUrl" label="Original link" sortable={false} />
      <UrlField source="shortenedUrl" label="Short link" sortable={false} />
      <UrlField source="brandedUrl" label="Brand link" sortable={false} />
      <ReferenceField source="creatorId" reference="users" label="Created by">
        <TextField source="name" />
      </ReferenceField>
      <DateField
        source="createdAt"
        label="Created at"
        style={{ wordBreak: 'normal' }}
      />
      <DateField
        source="updatedAt"
        label="Updated at"
        style={{ wordBreak: 'normal' }}
      />
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

const schemaAt = getJsonPath('Link')

export const Edit = props => (
  <EditHOC {...props}>
    <SimpleForm
      submitOnEnter={false}
      warnWhenUnsavedChanges
      validate={validator('Link')}
    >
      <TextInput
        disabled={schemaAt('originalUrl').readOnly}
        source="originalUrl"
        label="Original Link"
        tyle="url"
      />
      <TextInput
        disabled={schemaAt('hash').readOnly}
        source="hash"
        label="Short Link"
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start"
              style={{ marginRight: 0, marginBottom: '-3px' }}
            >
              {process.env.REACT_APP_BASE_URL}/
            </InputAdornment>
          )
        }}
      />
      <TextInput
        disabled={schemaAt('brandedUrl').readOnly}
        source="brandedUrl"
        label="Brand Link"
        type="url"
      />

      <TextInput
        disabled={schemaAt('meta.title').readOnly}
        source="meta.title"
        label="Title"
      />
      <TextInput
        disabled={schemaAt('meta.description').readOnly}
        multiline
        source="meta.description"
        label="Description"
      />
      <TextInput
        disabled={schemaAt('meta.author').readOnly}
        source="meta.author"
        label="Author"
      />
      <TextInput
        disabled={schemaAt('meta.publisher').readOnly}
        source="meta.publisher"
        label="Publisher"
      />
      <TextInput
        disabled={schemaAt('meta.lang').readOnly}
        source="meta.lang"
        label="Language"
      />
      <DateTimeInput
        disabled={schemaAt('meta.date').readOnly}
        source="meta.date"
        label="Original link created at"
      />
    </SimpleForm>
  </EditHOC>
)
