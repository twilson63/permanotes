const template = `
<div>
  {{#assets}}
  <div class="card">
    <img src={{image_thumbnail_url}} alt={{description}} />
    <a href={{permalink}}>View on Opensea</a>
  </div>
  {{/assets}}
</div>
`
export default {
  name: 'opensea',
  icon: '',
  template
}