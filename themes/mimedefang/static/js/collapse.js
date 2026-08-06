(function () {
  var TRANSITION_MS = 350;
  var instances = new WeakMap();

  function Collapse(el) {
    this.el = el;
    instances.set(el, this);
  }

  Collapse.getInstance = function (el) {
    return instances.get(el);
  };

  Collapse.prototype.show = function () {
    var el = this.el;
    if (el.classList.contains('show')) return;
    el.dispatchEvent(new CustomEvent('show.bs.collapse', { bubbles: true }));
    el.classList.remove('collapse');
    el.classList.add('collapsing');
    el.style.height = '0px';
    requestAnimationFrame(function () {
      el.style.height = el.scrollHeight + 'px';
    });
    window.setTimeout(function () {
      el.classList.remove('collapsing');
      el.classList.add('collapse', 'show');
      el.style.height = '';
      el.dispatchEvent(new CustomEvent('shown.bs.collapse', { bubbles: true }));
    }, TRANSITION_MS);
  };

  Collapse.prototype.hide = function () {
    var el = this.el;
    if (!el.classList.contains('show')) return;
    el.dispatchEvent(new CustomEvent('hide.bs.collapse', { bubbles: true }));
    el.style.height = el.scrollHeight + 'px';
    el.classList.remove('collapse', 'show');
    el.classList.add('collapsing');
    requestAnimationFrame(function () {
      el.style.height = '0px';
    });
    window.setTimeout(function () {
      el.classList.remove('collapsing');
      el.classList.add('collapse');
      el.style.height = '';
      el.dispatchEvent(new CustomEvent('hidden.bs.collapse', { bubbles: true }));
    }, TRANSITION_MS);
  };

  Collapse.prototype.toggle = function () {
    if (this.el.classList.contains('show')) {
      this.hide();
    } else {
      this.show();
    }
  };

  function targetOf(trigger) {
    var selector = trigger.getAttribute('data-bs-target') || trigger.getAttribute('href');
    return selector ? document.querySelector(selector) : null;
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-bs-toggle="collapse"]');
    if (!trigger) return;
    var target = targetOf(trigger);
    if (!target) return;
    e.preventDefault();
    var instance = Collapse.getInstance(target) || new Collapse(target);
    instance.toggle();
  });

  window.bootstrap = window.bootstrap || {};
  window.bootstrap.Collapse = Collapse;
})();
