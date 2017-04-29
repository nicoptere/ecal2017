
// Return points representing an enlarged polygon.
function outline( old_points, offset){
    var enlarged_points = [];

    var num_points = old_points.length;
    for(var j = 0; j < num_points; j++){

        // Find the new location for point j.
        // Find the points before and after j.
        var i = (j - 1);
        if (i < 0) i += num_points;
        var k = (j + 1) % num_points;

        // Move the points by the offset.
        var v1 = new Point(old_points[j].x - old_points[i].x,old_points[j].y - old_points[i].y);

        v1.normalize();
        v1.multiplyScalar(offset);
        var n1 = new Point(-v1.y, v1.x);

        var pij1 = new Point(
            old_points[i].x + n1.x,
            old_points[i].y + n1.y);
        var pij2 = new Point(
            old_points[j].x + n1.x,
            old_points[j].y + n1.y);

        var v2 = new Point(
            old_points[k].x - old_points[j].x,
            old_points[k].y - old_points[j].y);
        v2.normalize().multiplyScalar(offset);

        var n2 = new Point(-v2.y, v2.x);
        var pjk1 = new Point(
            old_points[j].x + n2.x,
            old_points[j].y + n2.y);
        var pjk2 = new Point(
            old_points[k].x + n2.x,
            old_points[k].y + n2.y);

        var poi = LineIntersection(pij1, pij2, pjk1, pjk2, false );
        if( poi != null ){
            enlarged_points.push(poi);
        }
    }

    return enlarged_points;
}
