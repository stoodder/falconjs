(function(exports){
	var Rect = joint.shapes.basic.Rect;
	var Paper = joint.dia.Paper;
	var Graph = joint.dia.Graph;
	var Path = joint.shapes.basic.Path;
	var Link = joint.dia.Link;
	var Circle = joint.shapes.basic.Circle;

	var scalePaper = function(paper, parentNode, originalWidth) {
		ratio = Math.min(1, parentNode.offsetWidth/originalWidth)
		paper.scale( ratio )
	}

	var makeLink = function(graph, source, target)
	{
		// TODO Set better source and target points using form: {x,y}
		line = new Link({
			source: {id: source.id},
			target: {id: target.id},
			attrs: {
				'.connection': {
					'pointer-events': 'none',
					'stroke': '#880000'
				}
			}
		});

		line.showSourceArrow = function(fill)
		{
			line.attr({
				'.marker-source': {
					'd': 'M 10 0 L 0 5 L 10 10 z',
					'fill': fill || "#880000",
					'stroke-width': 0
				}
			});

			return line;
		};

		line.showTargetArrow = function(fill)
		{
			line.attr({
				'.marker-target': {
					'd': 'M 10 0 L 0 5 L 10 10 z',
					'fill': fill || "#880000",
					'stroke-width': 0
				}
			});

			return line;
		};

		line.dashed = function()
		{
			line.attr({
				'.connection': {'stroke-dasharray': '3 3'}
			});

			return line;
		};

		line.setLabel = function(label, options)
		{
			options = options || {};
			options.position = options.position || 0.5;
			options.attrs = options.attrs || {};
			
			options.attrs.rect = _.extend({
				'height': '50',
				'width': '50',
				'pointer-events': 'none',
				"fill": "#fff7f7",
				"stroke-width": 0
			}, options.attrs.rect || {});
			
			options.attrs.text = _.extend({
				'font-size': '14px',
				'font-family': 'Arial',
				'pointer-events': 'none',
				"text": " " + (label || "") + " ",
				"fill": "#880000"
			}, options.attrs.text || {});

			line.label(0, options);

			return line;
		}
		
		graph.addCell(line);

		return line;
	};

	var makeRect = function(graph, label, options)
	{
		options = options || {};
		options.position = options.position || {};
		options.size = options.size || {};
		options.attrs = options.attrs || {};
		options.attrs.rect = options.attrs.rect || {};
		options.attrs.text = options.attrs.text || {};

		label = label || "";

		options = _.extend(options, {
			'position': _.extend({ x: 0, y: 0 }, options.position),
			'size': _.extend({ width: 100, height: 30 }, options.size),
			'attrs': _.extend(options.attrs, {
				'rect': _.extend({
					'cursor': 'default',
					'pointer-events': 'none',
					'fill': '#FFC3C3',
					'stroke-width': 0,
					'rx': 5,
					'ry': 5
				}, options.attrs.rect),

				'text': _.extend({
					'cursor': 'default',
					'pointer-events': 'none',
					'text': label,
					'fill': '#dd1144'
				}, options.attrs.text)
			})
		});

		var shape = new Rect(options);
		graph.addCell(shape);

		return shape;
	};

	var makeDiamond = function(graph, label, options)
	{
		options = options || {};
		options.size = _.extend({
			height: 100,
			width: 100
		}, options.size || {});

		options.attrs = options.attrs || {};

		options.attrs.path = _.extend({
			'd': 'M 30 0 L 60 30 30 60 0 30 z',
			'cursor': 'default',
			'pointer-events': 'none',
			"fill": "#FFC3C3",
			'stroke-width': 0
		}, options.attrs.path || {});
		
		options.attrs.text = _.extend({
			'cursor': 'default',
			'pointer-events': 'none',
			"text": label || "",
			"fill": "#dd1144",
			'ref-y': 0.5,
			'ref-x': 0.5
		}, options.attrs.text || {});

		var shape = new Path(options)
		graph.addCell(shape);

		return shape;
	}

	var makeCircle = function(graph, label, options)
	{
		options = options || {};
		options.size = _.extend({
			height: 100,
			width: 100
		}, options.size || {});

		options.attrs = options.attrs || {};

		options.attrs.circle = _.extend({
			'cursor': 'default',
			'pointer-events': 'none',
			"fill": "#FFC3C3"
		}, options.attrs.circle || {});
		
		options.attrs.text = _.extend({
			'cursor': 'default',
			'pointer-events': 'none',
			"text": label || "",
			"fill": "#dd1144"
		}, options.attrs.text || {});

		var shape = new Circle(options)
		graph.addCell(shape);

		return shape;
	}

	exports.renderArchitectureDiagram = function (parentNode)
	{

		var graph = new Graph;

		var paper = new Paper({
			el: parentNode,
			gridSize: 1,
			model: graph
		});

		var boundary_shape = makeRect(graph, null, {
			position: {
				x: 120,
				y: 0
			},
			size: {
				height: 250,
				width: 440 + 40 // 40 is the binding shape
			},
			attrs: {
				rect: {
					'fill': "#fff7f7",
					'rx': 2,
					'ry': 2
				}
			}
		});

		var BOUNDARY_BBOX = boundary_shape.getBBox()
		var BOUNDARY_X = BOUNDARY_BBOX.x;
		var BOUNDARY_Y = BOUNDARY_BBOX.y;
		var BOUNDARY_WIDTH = BOUNDARY_BBOX.width;
		var BOUNDARY_HEIGHT = BOUNDARY_BBOX.height;
		var BOUNDARY_CENTER_X = BOUNDARY_X + BOUNDARY_WIDTH/2;
		var BOUNDARY_CENTER_Y = BOUNDARY_Y + BOUNDARY_HEIGHT/2;

		var boundary_label_shape = makeRect(graph, "Falcon.js", {
			position: {x: BOUNDARY_X, y: BOUNDARY_Y},
			size: {width: 80, height: 40},
			attrs: {
				rect: {
					'fill': 'transparent'
				},
				text: {
					'fill': '#FFC3C3',
					'text-anchor': 'start'
				}
			}
		});

		var adapter_shape = makeRect(graph, "Adapter", {
			position: {
				x: BOUNDARY_X + 40,
				y: BOUNDARY_CENTER_Y - 15
			}
		});

		var model_shape = makeRect(graph, "Models", {
			position: {
				x: BOUNDARY_X + 40 + 100 + 30 - 10,
				y: BOUNDARY_CENTER_Y - 15 - 75
			}
		});

		var collection_shape = makeRect(graph, "Collections", {
			position: {
				x: BOUNDARY_X + 40 + 100 + 30 - 10,
				y: BOUNDARY_CENTER_Y - 15 + 75
			}
		});

		var view_shape = makeRect(graph, "Views", {
			position: {
				x: BOUNDARY_X + 40 + 200 + 30 + 30 - 20,
				y: BOUNDARY_CENTER_Y - 15
			}
		});

		var backend_shape = makeRect(graph, "Backend", {
			position: {
				x: 5,
				y: BOUNDARY_CENTER_Y - 50
			},

			size: {
				height: 100,
				width: BOUNDARY_X - 40
			},

			attrs: {
				rect: {
					'fill': "#fff7f7",
					'stroke': "#FFC3C3",
					'stroke-width': 2
				},
				text: {
					'fill': "#dd1144"
				}
			}
		});

		var binding_shape = makeDiamond(graph, "Bindings", {
			position: {
				x: BOUNDARY_X + BOUNDARY_WIDTH - 40,
				y: BOUNDARY_CENTER_Y - 40
			},

			size: {
				height: 80,
				width: 80
			}
		});

		var templates_shape = makeRect(graph, "Templates", {
			position: {
				x: BOUNDARY_X + BOUNDARY_WIDTH + 20 + 30 + 20,
				y: BOUNDARY_Y + 20
			}
		});

		var output_shape = makeRect(graph, "Rendered HTML", {
			position: {
				x: BOUNDARY_X + BOUNDARY_WIDTH + 20 + 30,
				y: BOUNDARY_Y + BOUNDARY_HEIGHT - 50 - 20
			},

			size: {
				height: 50,
				width: 120
			},

			attrs: {
				'rect': {
					'fill': '#fff7f7',
					'stroke': '#FFC3C3',
					'stroke-width': 2
				},

				text: {
					'fill': '#dd1144'
				}
			}
		})

		// Embed elements into the boundary
		boundary_shape.embed(boundary_label_shape);
		boundary_shape.embed(model_shape);
		boundary_shape.embed(collection_shape);
		boundary_shape.embed(adapter_shape);
		boundary_shape.embed(view_shape);

		// Add links
		makeLink(graph, backend_shape, adapter_shape).showSourceArrow().showTargetArrow();
		makeLink(graph, adapter_shape, collection_shape).showSourceArrow().showTargetArrow();
		makeLink(graph, adapter_shape, model_shape).showSourceArrow().showTargetArrow();
		makeLink(graph, model_shape, collection_shape).showSourceArrow().showTargetArrow();
		makeLink(graph, model_shape, view_shape).showTargetArrow();
		makeLink(graph, collection_shape, view_shape).showTargetArrow();
		makeLink(graph, view_shape, templates_shape).dashed().setLabel("url", {position: 0.4});
		makeLink(graph, view_shape, binding_shape).showTargetArrow();
		makeLink(graph, templates_shape, binding_shape).showTargetArrow();
		makeLink(graph, binding_shape, output_shape).showTargetArrow();

		// Ensure elements with parents stay in their parents
		graph.on('change:position', function(cell) {
			var parentId = cell.get('parent');
			if (!parentId) return;

			var parent = graph.getCell(parentId);
			var parentBbox = parent.getBBox();
			var cellBbox = cell.getBBox();

			if (parentBbox.containsPoint(cellBbox.origin()) &&
				parentBbox.containsPoint(cellBbox.topRight()) &&
				parentBbox.containsPoint(cellBbox.corner()) &&
				parentBbox.containsPoint(cellBbox.bottomLeft())) {

				// All the four corners of the child are inside
				// the parent area.
				return;
			}

			// Revert the child position.
			cell.set('position', cell.previous('position'));
		});

		// Watch events on the parent node
		paper.fitToContent(1, 1, 20);
		var ORIGINAL_WIDTH = paper.getContentBBox().width;

		window.addEventListener("resize", function(){
			scalePaper(paper, parentNode, ORIGINAL_WIDTH);
		});

		scalePaper(paper, parentNode, ORIGINAL_WIDTH);
	};
})(window);