import Avatar from '@material-ui/core/Avatar'
import get from 'lodash/get'

export default function AvatarField({ source, record = {} }) {
  return (
    <Avatar title={get(record, 'name')} src={get(record, source || 'avatar')} />
  )
}
