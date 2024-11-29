export const setTabs = function () {
  // Geração de ID's automáticos.
  $('.tab').each(function () {
    let tabLinks = $(this).find('.tab-link');
    let tabItems = $(this).find('.tab-content-item');

    tabLinks.each(function (index) {
      let link = $(this);
      let item = $(tabItems[index]);

      link.attr('data-nav-id', index + 1);
      item.attr('data-content-id', index + 1);
    });

    const isTabVertical = $(this).attr('data-type') === 'vertical';
    const lengthOfContent = tabItems.length;

    if (isTabVertical) {
      const rowHeight = $(this).css('--tab-ver-row-height');

      // $(this).css('--tab-ver-template-rows', `1fr repeat(${lengthOfContent}, ${rowHeight}) 1fr`);
      $(this).css('--tab-ver-template-rows', 'repeat(auto-fit, minmax(0,1fr))');

      // tabLinks.each(function (index) {
      //   const link = $(this);
      //   link.css('grid-row', `${index + 1}`);
      // });

      tabItems.css({
        'grid-row': `1 / span ${lengthOfContent}`,
      });
    } else {
      $(this).css({
        '--tab-hor-template-columns': `repeat(${lengthOfContent}, 1fr)`,
        '--tab-hod-column-length': lengthOfContent
      });
    }
  });

  // Controla toda a interação do componente.
  $('.tab .tab-link').on('click', function (event) {
    event.preventDefault();

    let currentTab = $(this).closest('.tab');
    let currentLink = $(this);

    let { navId } = currentLink.data();

    currentTab.find('.tab-link, .tab-content-item').removeClass('is-active');
    currentLink.addClass('is-active clicked');
    currentTab.find('.tab-content-item').filter(`[data-content-id="${navId}"]`).addClass('is-active');
  });
};
