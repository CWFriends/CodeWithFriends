export default {
  name: 'user',
  title: 'User',
  type: 'document',
  __experimental_actions: [/*'create', 'update', 'delete', 'publish'*/],
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'username',
      title: 'Username',
      type: 'string'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'url'
    },

  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    }
  }
}
