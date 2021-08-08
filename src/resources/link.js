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
  DateTimeInput,
  usePermissions,
  Toolbar,
  SaveButton,
  DeleteButton
} from 'react-admin'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'
import { subject } from '@casl/ability'
import validator from '../providers/validator'
import getJsonPath from '../utils/get-json-path'

export const List = props => (
  <DataList {...props} perPage={15}>
    <Datagrid rowClick="show">
      <UrlField source="originalUrl" label="Original link" sortable={false} />
      <UrlField source="shortenedUrl" label="Short link" sortable={false} />
      <UrlField source="brandedUrl" label="Brand link" sortable={false} />
      <ReferenceField
        source="creatorId"
        reference="users"
        label="Created by"
        link="show"
      >
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

const schemaAt = getJsonPath('Link')

export const Edit = props => (
  <EditHOC {...props}>
    <EditComponent />
  </EditHOC>
)

const EditComponent = props => {
  const { loading, permissions } = usePermissions()
  const resource = subject('Link', props.record)

  return loading ? (
    <div>Loading...</div>
  ) : (
    <SimpleForm
      submitOnEnter={false}
      warnWhenUnsavedChanges
      validate={validator('Link')}
      toolbar={
        <Toolbar {...props} style={{ display: 'flex' }}>
          <SaveButton />
          <div style={{ flexGrow: 1 }} />
          <DeleteButton disabled={permissions.cannot('delete', resource)} />
        </Toolbar>
      }
      {...props}
    >
      <TextInput
        disabled={
          schemaAt('originalUrl').readOnly ||
          permissions.cannot('update', resource, 'originalUrl')
        }
        source="originalUrl"
        label="Original Link"
        tyle="url"
      />
      <TextInput
        disabled={
          schemaAt('shortenedUrl').readOnly ||
          permissions.cannot('update', resource, 'shortenedUrl')
        }
        source="shortenedUrl"
        label="Short Link"
        type="url"
      />
      <TextInput
        disabled={
          schemaAt('hash').readOnly ||
          permissions.cannot('update', resource, 'hash')
        }
        source="hash"
        label="Brand Link"
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
        disabled={
          schemaAt('meta.title').readOnly ||
          permissions.cannot('update', resource, 'meta.title')
        }
        source="meta.title"
        label="Title"
      />
      <TextInput
        disabled={
          schemaAt('meta.description').readOnly ||
          permissions.cannot('update', resource, 'meta.description')
        }
        multiline
        source="meta.description"
        label="Description"
      />
      <TextInput
        disabled={
          schemaAt('meta.author').readOnly ||
          permissions.cannot('update', resource, 'meta.author')
        }
        source="meta.author"
        label="Author"
      />
      <TextInput
        disabled={
          schemaAt('meta.publisher').readOnly ||
          permissions.cannot('update', resource, 'meta.publisher')
        }
        source="meta.publisher"
        label="Publisher"
      />
      <TextInput
        disabled={
          schemaAt('meta.lang').readOnly ||
          permissions.cannot('update', resource, 'meta.lang')
        }
        source="meta.lang"
        label="Language"
      />
      <DateTimeInput
        disabled={
          schemaAt('meta.date').readOnly ||
          permissions.cannot('update', resource, 'meta.date')
        }
        source="meta.date"
        label="Original link created at"
      />
    </SimpleForm>
  )
}
