'use strict';

{

    const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
  }

    const optArticleSelector = '.post';
    const optTitleSelector = '.post-title';
    const optTitleListSelector = '.titles';
    const optArticleTagsSelector = '.post-tags .list';
    const optArticleAuthorSelector = '.post-author';
    const optTagsListSelector = '.tags.list';
    const optCloudClassCount = '4';
    const optCloudClassPrefix = 'tag-size-';
    const optAuthorsListSelector = '.authors.list';


    const titleClickHandler = function(event) {
        event.preventDefault();
        const clickedElement = this;

        /* [DONE] remove class 'active' from all article links  */

        const activeLinks = document.querySelectorAll('.titles a.active');

        for(let activeLink of activeLinks) {
            activeLink.classList.remove('active')
        }

        /* [DONE] add class 'active' to the clicked link */

        clickedElement.classList.add('active');

        /* [DONE] remove class 'active' from all articles */

        const activeArticles = document.querySelectorAll('.post.active');

        for(let activeArticle of activeArticles) {
            activeArticle.classList.remove('active')
        }

        /* [DONE] get 'href' attribute from the clicked link */

        const articleSelector = clickedElement.getAttribute('href');

        /* [DONE] find the correct article using the selector (value of 'href' attribute) */

        const targetArticle = document.querySelector(articleSelector);

        /* [DONE] add class 'active' to the correct article */

        targetArticle.classList.add('active');
    }


    function generateTitleLinks(customSelector = '') {

        /* [DONE] remove contents of titleList */

        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';

        /* [DONE] for each article */

        const articles = document.querySelectorAll(optArticleSelector + customSelector);

        let html = '';

        for(let article of articles) {

          /* [DONE] get the article id */

          const articleId = article.getAttribute('id');

          /* [DONE] find the title element */
          /* [DONE] get the title from the title element */

          const articleTitle = article.querySelector(optTitleSelector).innerHTML;

          /* [DONE] create HTML of the link */

          /* const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>'; */

          const linkHTMLData = {id: articleId, title: articleTitle};
          const linkHTML = templates.articleLink(linkHTMLData);

          /* [DONE] insert link into titleList*/

          html = html + linkHTML;

          /*titleList.innerHTML = titleList.innerHTML + linkHTML; - correct code but not effective for expanded code*/
          /*titleList.insertAdjacentHTML('beforeend', linkHTML); - code with insertAdjacementTHML function*/

        }

        titleList.innerHTML = html;
    }

    generateTitleLinks();

    const links = document.querySelectorAll('.titles a');

    for(let link of links) {
        link.addEventListener('click', titleClickHandler)
    }


    function addClickListenersToLinks() {
      const links = document.querySelectorAll('.titles a');

      for(let link of links) {
          link.addEventListener('click', titleClickHandler)
      }
    }

    addClickListenersToLinks();


    function calculateTagsParams(tags) {
      const params = {
        max: 0,
        min: 999999
      }
      for(let tag in tags) {

        if(tags[tag] > params.max) {
          params.max = tags[tag];
        }
        if(tags[tag] < params.min) {
          params.min = tags[tag];
        }
      }

      return params;
    }


    function calculateTagClass(count,params) {
      const normalizedCount = count - params.min;
      const normalizedMax = params.max - params.min;
      const percentage = normalizedCount / normalizedMax;
      const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
      return (optCloudClassPrefix, classNumber);
    }

    function generateTags() {
      /* [NEW] create a new variable allTags with an empty object */
      let allTags = {};

      /* find all articles */

      const articles = document.querySelectorAll(optArticleSelector);

      /* START LOOP: for every article: */

      for(let article of articles) {

        const titleList = article.querySelector(optArticleTagsSelector);

        /* make html variable with empty string */

        let html = '';

        /* get tags from data-tags attribute */

        const articleTags = article.getAttribute('data-tags');

       /* split tags into array */

       const articleTagsArray = articleTags.split(' ');

       /* START LOOP: for each tag */

       for(let tag of articleTagsArray) {

         /* generate HTML of the link */

         /*const linkHTML = '<li><a href="#tag-' + tag +'"<span>' + tag + '</span></a></li> '; */

         const linkHTMLData = {id: tag, title: tag};
         const linkHTML = templates.tagLink(linkHTMLData);

         /* add generated code to html variable */

         html = html + linkHTML;

          /* [NEW] check if this link is NOT already in allTags */
          if(!allTags.hasOwnProperty(tag)) {
            /* [NEW] add generated code to allTags array */
            allTags[tag] = 1;
          } else {
            allTags[tag]++;
          }

       /* END LOOP: for each tag */
      }

      /* insert HTML of all the links into the tags wrapper */

      titleList.innerHTML = html;

    /* END LOOP: for every article: */
    }

      /* [NEW] find list of tags in right column */
      const tagList = document.querySelector('.tags');

      /* [NEW] create variable for all links HTML code */

      const tagsParams = calculateTagsParams(allTags);

      /*let allTagsHTML = '';*/
      const allTagsData = {tags: []};

      /* START LOOP: for each tag in allTagsHTML */

      for(let tag in allTags) {

        /* generate code of a link and add it to allTagsHTML */

        /*const tagLinkHTML = '<li><a class="'+ optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '"' + ' href="#tag-' + tag +'">' + tag + '</a></li>'; */

        allTagsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateTagClass(allTags[tag], tagsParams)
        });


        /*allTagsHTML = allTagsHTML + tagLinkHTML; */

      /* END LOOP: for each tag in allTagsHTML */
      }

      /* add html from allTagsHTML to tagList */

      /*tagList.innerHTML = allTagsHTML;*/
      tagList.innerHTML = templates.tagCloudLink(allTagsData);

    }

    generateTags();


    function tagClickHandler(event) {
      /* prevent default action for this event */

      event.preventDefault();

      /* make new constant named "clickedElement" and give it the value of "this" */

      const clickedElement = this;

      /* make a new constant "href" and read the attribute "href" of the clicked element */

      const href = clickedElement.getAttribute('href');

      /* make a new constant "tag" and extract tag from the "href" constant */

      const tag = href.replace('#tag-', '');

      /* find all tag links with class active */

      const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

      /* START LOOP: for each active tag link */

      for(let activeTagLink of activeTagLinks) {

        /* remove class active */

        activeTagLink.classList.remove('active');

      /* END LOOP: for each active tag link */

      }

      /* find all tag links with "href" attribute equal to the "href" constant */

      const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

      /* START LOOP: for each found tag link */

      for(let tagLink of tagLinks) {

        /* add class active */

        tagLink.classList.add('active');

      /* END LOOP: for each found tag link */
      }

      /* execute function "generateTitleLinks" with article selector as argument */

      generateTitleLinks('[data-tags~="' + tag + '"]');

    }


    function addClickListenersToTags() {

      /* find all links to tags */

      const links = document.querySelectorAll('.post-tags a');

      /* START LOOP: for each link */

      for(let link of links) {

        /* add tagClickHandler as event listener for that link */

        link.addEventListener('click', tagClickHandler);

      /* END LOOP: for each link */
      }
    }

    addClickListenersToTags();


    function calculateAuthorsParams(tags) {
      const params = {
        max: 0,
        min: 999999
      }
      for(let tag in tags) {
        if(tags[tag] > params.max) {
          params.max = tags[tag];
        }
        if(tags[tag] < params.min) {
          params.min = tags[tag];
        }
      }

      return params;
    }


    function calculateAuthorsClass(count,params) {
      const normalizedCount = count - params.min;
      const normalizedMax = params.max - params.min;
      const percentage = normalizedCount / normalizedMax;
      const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
      return (optCloudClassPrefix, classNumber);
    }

    function generateAuthors() {

      /* [NEW] create a new variable allTags with an empty object */
      let allTags = {};

      /* find all articles */

      const articles = document.querySelectorAll(optArticleSelector);

      /* START LOOP: for every article*/

      for(let article of articles) {

        const authorList = article.querySelector(optArticleAuthorSelector);

        /* make html variable with empty string */

        let html = '';

        /* get authors from data-author attribute */

        const articleAuthor = article.getAttribute('data-author');

        /* generate HTML of the link */

        /* const linkHTML = '<a href="#author-' + articleAuthor +'"<span>' + articleAuthor + '</span></a>'; */

        const linkHTMLData = {id: articleAuthor, title: articleAuthor};
        const linkHTML = templates.authorLink(linkHTMLData);

        /* add generated code to html variable */

        html = html + linkHTML;

         /* [NEW] check if this link is NOT already in allTags */

         if(!allTags.hasOwnProperty(articleAuthor)) {

          /* [NEW] add generated code to allTags array */

          allTags[articleAuthor] = 1;
        } else {
          allTags[articleAuthor]++;
        }

        /* insert HTML of all the links into the author wrapper */

        authorList.innerHTML = html;
      }

      /* [NEW] find list of tags in right column */
      const tagList = document.querySelector('.authors');

      /* [NEW] create variable for all links HTML code */

      const authorsParams = calculateAuthorsParams(allTags);

      /* let allTagsHTML = ''; */
      const allAutorsData = {tags: []};

      /* START LOOP: for each tag in allTagsHTML */

      for(let tag in allTags) {

        /* generate code of a link and add it to allTagsHTML */

        /* const tagLinkHTML = '<li><a class="'+ optCloudClassPrefix + calculateAuthorsClass(allTags[tag], authorsParams) + '"' + ' href="#author-' + tag +'">' + tag + '</a></li>'; */

        allAutorsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateAuthorsClass(allTags[tag], authorsParams)
        });

        /* allTagsHTML = allTagsHTML + tagLinkHTML; */

      /* END LOOP: for each tag in allTagsHTML */
      }

      /* add html from allTagsHTML to tagList */

     /* tagList.innerHTML = allTagsHTML; */
      tagList.innerHTML = templates.authorCloudLink(allAutorsData);

    }

    generateAuthors();


    function authorClickHandler(event) {
      /* prevent default action for this event */

      event.preventDefault();

      /* make new constant named "clickedElement" and give it the value of "this" */

      const clickedElement = this;

      /* make a new constant "href" and read the attribute "href" of the clicked element */

      const href = clickedElement.getAttribute('href');

      /* make a new constant "author" and extract author from the "href" constant */

      const author = href.replace('#author-', '');

      /* find all authors links with class active */

      const activeAuthorLinks = document.querySelectorAll('.post-author.list a');

      /* START LOOP: for each active author link */

      for(let activeAuthorLink of activeAuthorLinks) {

        /* remove class active */

        activeAuthorLink.classList.remove('active');

      /* END LOOP: for each active author link */

      }

      /* find all author links with "href" attribute equal to the "href" constant */

      const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

      /* START LOOP: for each found author link */

      for(let authorLink of authorLinks) {

        /* add class active */

        authorLink.classList.add('active');

      /* END LOOP: for each found author link */
      }

      /* execute function "generateTitleLinks" with article selector as argument */

      generateTitleLinks('[data-author="' + author + '"]');

    }


    function addClickListenersToAuthors() {

      /* find all links to authors */

      const links = document.querySelectorAll('.post-author a');

      /* START LOOP: for each link */

      for(let link of links) {

        /* add tagClickHandler as event listener for that link */

        link.addEventListener('click', authorClickHandler);

      /* END LOOP: for each link */
      }
    }

    addClickListenersToAuthors();

}


