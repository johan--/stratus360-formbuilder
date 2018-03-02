({
  renderIcon: function(component) {
    var prefix = "slds-";
    var svgns = "http://www.w3.org/2000/svg";
    var xlinkns = "http://www.w3.org/1999/xlink";
    var size = component.get("v.Size");
    var name = component.get("v.Name");
    var classname = component.get("v.Class");
    var containerclass = component.get("v.ContainerClass");
    var category = component.get("v.Category");

    var containerClassName = [
        prefix+"icon_container",
        prefix+"icon-"+category+"-"+name,
        containerclass
        ].join(' ');
    component.set("v.ContainerClass", containerClassName);

    var svgroot = document.createElementNS(svgns, "svg");
    var iconClassName = prefix+"icon "+prefix+"icon--" + size+" "+classname;
    svgroot.setAttribute("aria-hidden", "true");
    svgroot.setAttribute("class", iconClassName);
    svgroot.setAttribute("name", name);

    // Add an "href" attribute (using the "xlink" namespace)
    var shape = document.createElementNS(svgns, "use");
    shape.setAttributeNS(xlinkns, "href", component.get("v.SvgPath"));
    svgroot.appendChild(shape);

    var container = component.find("container").getElement();
    container.insertBefore(svgroot, container.firstChild);
  }
})