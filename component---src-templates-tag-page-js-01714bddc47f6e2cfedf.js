"use strict";(self.webpackChunkgatsby_simple_blog=self.webpackChunkgatsby_simple_blog||[]).push([[423],{701:function(e,t,n){n.d(t,{Z:function(){return m}});var a=n(7294),l=n(1082),r=n(9175),o=n(5868),i=n(1939),s=n(2543);const c=function(e){let t,n,{slug:c,title:m,date:u,timeToRead:d,excerpt:g,tags:p,base:f}=e;return g&&(t=a.createElement("p",{dangerouslySetInnerHTML:{__html:g}})),p&&(n=a.createElement(s.Z,{style:{margin:"0.5rem 0 -0.5rem -0.5rem"},tags:p,baseUrl:`${f}tags`})),a.createElement("article",null,a.createElement("header",null,a.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",fontSize:(0,r.qZ)(1),marginBottom:(0,r.qZ)(1/4)}},a.createElement(l.Link,{style:{boxShadow:"none"},to:c,rel:"bookmark"},m)),n,a.createElement("small",null,`${(0,i.p)(u)} • ${(0,o.formatReadingTime)(d)}`),t))};c.defaultProps={title:null,excerpt:null,tags:null,base:""};var m=c},9010:function(e,t,n){n.d(t,{Z:function(){return s}});var a=n(7294),l=n(4593),r=n(1082),o=n(8278);const i=function(e){let{description:t,meta:n,keywords:i,title:s}=e;const{site:c}=(0,r.useStaticQuery)("1522010811"),{lang:m}=(0,o.Jr)(),u=t||c.siteMetadata.description;return a.createElement(l.q,{htmlAttributes:{lang:m||c.siteMetadata.lang},title:s,titleTemplate:`%s | ${c.siteMetadata.title}`,meta:[{name:"description",content:u},{property:"og:title",content:s},{property:"og:description",content:u},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:c.siteMetadata.author},{name:"twitter:title",content:s},{name:"twitter:description",content:u}].concat(i.length>0?{name:"keywords",content:i.join(", ")}:[]).concat(n)})};i.defaultProps={meta:[],keywords:[],description:""};var s=i},2543:function(e,t,n){n.d(t,{Z:function(){return i}});var a=n(7294),l=n(5868),r=n(7174);const o=function(e){let{tags:t,baseUrl:n,...o}=e;return a.createElement("ul",Object.assign({className:"tag-ul"},o),t.map((e=>a.createElement("li",{key:e},a.createElement(r.Z,{text:e,url:`${n}/${(0,l.kebabCase)(e)}`})))))};o.defaultProps={baseUrl:""};var i=o},4252:function(e,t,n){n.r(t);var a=n(7294),l=n(8762),r=n(9010),o=n(701),i=n(8125),s=n(8278),c=n(1939);t.default=function(e){let{pageContext:t,data:n,location:m}=e;const{tag:u}=t,{edges:d,totalCount:g}=n.allMarkdownRemark,p=n.site.siteMetadata.title,{lang:f,homeLink:b}=(0,s.Jr)(),y=(0,c.w)("tfTagHeader",g,u);return a.createElement(l.Z,{location:m,title:p,breadcrumbs:[{text:(0,c.w)("tTags"),url:`${b}tags`},{text:u}]},a.createElement(r.Z,{title:y,description:y}),a.createElement("h1",null,y),a.createElement("main",null,d.map((e=>{let{node:t}=e;const n=t.frontmatter.title||t.fields.slug;return a.createElement(o.Z,{key:t.fields.slug,base:b,lang:f,slug:t.fields.slug,date:t.frontmatter.date,timeToRead:t.timeToRead,title:n})}))),a.createElement("div",{style:{marginTop:50}}),a.createElement("aside",null,a.createElement(i.Z,null)))}}}]);
//# sourceMappingURL=component---src-templates-tag-page-js-01714bddc47f6e2cfedf.js.map