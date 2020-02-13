---
layout: default
title: Home
permalink: /pagetest/
---

## Page 2 
```
{: #id .class}
```
{% comment %}
Only working in Jekyll 4.0
<details open><summary>Contents
</summary>  

{% capture contents %}

* [One](/page/#1)
* [Two](/page/#2)

{% endcapture %}
{{ contents  | markdownify | remove: '<p>' | remove: '</p>' }}

</details>
{% endcomment %}

```javascript
  $(function() {
      $.get( "https://raw.githack.com/esd-org-uk/human-services/master/Schemas/documentation.html", function( data ) {
        $( "#docs" ).html( data );
      });      
      $.get( "https://rawcdn.githack.com/esd-org-uk/human-services/909f9161bdfda3cab3448c2ed09faa18a974ae90/README.md", function( data ) {
        let convert = new showdown.Converter();
        $( "#readme" ).html(convert.makeHtml(data));
      });
  });
```

```json
{
  "persona": [
    {
      "value": 0,
      "label": "Lonely",
      "data": {
        "needs": [
          "122", "71", "111", "115", "67", "36", "66", "68"
        ],
        "circumstances": [
          "1", "191", "185", "165", "205", "210", "213", "218", "220"
        ]
      }
    }
  ]
}
```
123
